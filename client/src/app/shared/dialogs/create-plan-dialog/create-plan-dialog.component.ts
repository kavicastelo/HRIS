import {Component, Inject, Renderer2} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OnboardinService} from "../../../services/onboardin.service";
import {EmployeesService} from "../../../services/employees.service";
import {MultimediaService} from "../../../services/multimedia.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationsService} from "../../../services/notifications.service";
import {Observable, tap} from "rxjs";
import {MatSelect} from "@angular/material/select";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-create-plan-dialog',
  templateUrl: './create-plan-dialog.component.html',
  styleUrls: ['./create-plan-dialog.component.scss']
})
export class CreatePlanDialogComponent {

  thisUserId:any;
  thisUser:any;

  receivedData:any;
  planDataStore:any[] = [];
  employeeDataStore:any[] = [];
  filteredEmployees:any[] = [];
  filteredManagers:any[] = [];

  taskTitles: any[] = [];
  taskNames: any[] = [{taskTitle: '', taskName: '', organizationId: '', onBoardingPlanId: '', adminEmail: '', description: '', startdate: '', taskdate: '', closed: '', status: '', monitoredBy: '', activityNotes: '', statusNotes: ''}];
  filteredTaskNames: any[] = [];

  loadTaskNames: any[] = [];
  filteredLoadTaskNames: any[] = [];

  organizationId: any;
  targetInput:any;
  targetManagerInput:any;

  onboardinPlanForm = new FormGroup({
    empName: new FormControl('', [Validators.required]),
    empId: new FormControl('', [Validators.required]),
    empEmail: new FormControl('', [Validators.required, Validators.email]),
    titlePlan: new FormControl('', [Validators.required]),
    departmentPlan: new FormControl('', [Validators.required]),
    managerPlan: new FormControl('', [Validators.required]),
    startDatePlan: new FormControl('', [Validators.required]),
    endDatePlan: new FormControl('', [Validators.required]),
    locationPlan: new FormControl(''),
    descriptionPlan: new FormControl('', [Validators.required]),
  })

  taskTitleForm = new FormGroup({
    taskTitleName: new FormControl('', [Validators.required])
  })

  tasksForm = new FormGroup({
    taskName: new FormControl('', [Validators.required])
  })

  constructor(private multimediaService: MultimediaService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private employeesService: EmployeesService,
              private notificationsService: NotificationsService,
              private renderer: Renderer2,
              private cookieService: AuthService,
              private onboardinService: OnboardinService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<CreatePlanDialogComponent>) {
  }

  async ngOnInit(): Promise<any> {
    this.receivedData = this.data;
    this.organizationId = this.cookieService.organization().toString();
    this.thisUserId = this.cookieService.userID().toString();

    await this.loadAllUsers().subscribe(()=>{
      this.getCurrentUser();
    })

    await this.loadAllTasks().subscribe(()=>{
      this.filterLoadTasks(this.receivedData.data.data.id.toString());
    })

    if (this.receivedData.data.userId && !this.receivedData.data.data.id){
      this.patchValues()
    } else if (this.receivedData.data.data.id){
      this.patchTemplateValues()
    }
  }

  closePopup(){
    this.dialog.closeAll()
  }

  loadAllUsers(): Observable<any> {
    return this.employeesService.getAllEmployees().pipe(
        tap(data => this.employeeDataStore = data)
    );
  }

  getCurrentUser(): Observable<any> {
    return this.thisUser = this.employeeDataStore.find((emp: any) => emp.id === this.thisUserId);
  }

  loadAllTasks(): Observable<any> {
    return this.onboardinService.getAllTasks().pipe(
        tap(data => this.loadTaskNames = data)
    );
  }

  filterLoadTasks(planId: any): any[]{
    this.filteredLoadTaskNames = this.loadTaskNames.filter((data: any) => data.organizationId === this.organizationId && data.onBoardingPlanId == planId)
    return this.filteredLoadTaskNames;
  }

  filterEmployees(): any[]{
    if (this.targetInput === undefined){
      this.filteredEmployees = this.employeeDataStore.filter((data: any) => data.organizationId === this.organizationId)
    }
    this.filteredEmployees.sort((a:any, b:any) => {
      return new Date(b.jobData.doj).getTime() - new Date(a.jobData.doj).getTime()
    })

    return this.filteredEmployees;
  }

  filterManagers(): any[]{
    if (this.targetManagerInput === undefined){
      this.filteredManagers = this.employeeDataStore.filter((data: any) => data.organizationId === this.organizationId && data.level === 1)
    }
    this.filteredManagers.sort((a:any, b:any) => {
      return new Date(b.jobData.doj).getTime() - new Date(a.jobData.doj).getTime()
    })

    return this.filteredManagers;
  }

  submitPlan(){
    if (this.onboardinPlanForm.valid){
      this.onboardinService.saveOnboardingPlan({
        organizationId: this.receivedData.data.organizationId,
        empName: this.onboardinPlanForm.value.empName,
        empId: this.onboardinPlanForm.value.empId,
        empEmail: this.onboardinPlanForm.value.empEmail,
        title: this.onboardinPlanForm.value.titlePlan,
        department: this.onboardinPlanForm.value.departmentPlan,
        manager: this.onboardinPlanForm.value.managerPlan,
        startDate: this.onboardinPlanForm.value.startDatePlan,
        taskDate: this.onboardinPlanForm.value.endDatePlan,
        location: this.onboardinPlanForm.value.locationPlan,
        description: this.onboardinPlanForm.value.descriptionPlan,
        taskTitles: this.taskTitles,
        status: 'Open',
        template: 'no'
      }).subscribe(data=>{
        this.submitTasks(data.message);
        this.closePopup();
        this.snackBar.open("Please wait a moment...!");
        this.filterEmployees().forEach((emp)=>{
          const notificationData = {
            userId: emp.id,
            notification: this.receivedData.data.userName + ' created a new onboarding plan',
            timestamp: new Date(),
            router: '/onboardin/plan',
            status: true
          }

          this.pushNotification(notificationData);
        })
        this.snackBar.dismiss();
        this.snackBar.open("New Plan Create!","Ok", {duration:3000})
      }, error => {
        console.log(error)
      })
    }
  }

  submitTasks(planId: any){
    if (this.taskNames.length > 0){
      this.onboardinService.saveTasksList(planId, this.taskNames).subscribe(data=>{
        //TODO: add notification
      }, error => {
        console.log(error)
      })
    }
  }

  updateTemplate(){
    this.onboardinService.updatePlan({
      id: this.receivedData.data.data.id,
      organizationId: this.receivedData.data.organizationId,
      empName: this.onboardinPlanForm.value.empName,
      empId: this.onboardinPlanForm.value.empId,
      empEmail: this.onboardinPlanForm.value.empEmail,
      title: this.onboardinPlanForm.value.titlePlan,
      department: this.onboardinPlanForm.value.departmentPlan,
      manager: this.onboardinPlanForm.value.managerPlan,
      startDate: this.onboardinPlanForm.value.startDatePlan,
      taskDate: this.onboardinPlanForm.value.endDatePlan,
      location: this.onboardinPlanForm.value.locationPlan,
      description: this.onboardinPlanForm.value.descriptionPlan,
      taskTitles: this.taskTitles,
      status: 'Open',
      template: 'yes'
    }).subscribe(data=>{
      this.updateTasks();
      this.closePopup();
      this.snackBar.open("Template Update!","Ok", {duration:3000})
    }, error => {
      console.log(error)
    })
  }

  updatePlan(){
    this.onboardinService.updatePlan({
      id: this.receivedData.data.data.id,
      organizationId: this.receivedData.data.organizationId,
      empName: this.onboardinPlanForm.value.empName,
      empId: this.onboardinPlanForm.value.empId,
      empEmail: this.onboardinPlanForm.value.empEmail,
      title: this.onboardinPlanForm.value.titlePlan,
      department: this.onboardinPlanForm.value.departmentPlan,
      manager: this.onboardinPlanForm.value.managerPlan,
      startDate: this.onboardinPlanForm.value.startDatePlan,
      taskDate: this.onboardinPlanForm.value.endDatePlan,
      location: this.onboardinPlanForm.value.locationPlan,
      description: this.onboardinPlanForm.value.descriptionPlan,
      taskTitles: this.taskTitles,
      status: 'Open',
      template: 'no'
    }).subscribe(data=>{
      this.updateTasks();
      this.closePopup();
      this.snackBar.open("Plan Update!","Ok", {duration:3000})
    }, error => {
      console.log(error)
    })
  }

  updateTasks(){
    this.onboardinService.updateTasksList(this.receivedData.data.data.id, this.taskNames).subscribe(data=>{
      //TODO: add notification
    }, error => {
      console.log(error)
    })
  }

  pushNotification(data:any){
    if (data){
      this.notificationsService.saveNotification(data).subscribe(data=>{
      }, error => {
        console.log(error)
      })
    }
  }

  focusFieldOnEnter(event: KeyboardEvent, nextField: any) {
    if (event.key === 'Enter') {
      if (nextField instanceof MatSelect) {
        nextField.open();
      } else {
        this.renderer.selectRootElement(nextField).focus();
      }
      event.preventDefault();
    }
  }

  keyFormSubmit(event: KeyboardEvent, method: any) {
    if (event.key === 'Enter' && !event.shiftKey) {
      // Prevent the default Enter key behavior (e.g., newline in textarea)
      event.preventDefault();

      // Perform the method
      if (method == 'save') {
        this.submitPlan()
      }
    }
  }

  removeTaskTitle(title: any, i: number) {
    this.taskNames.forEach(data => {
      if (data.taskTitle === title) {
        this.removeTask(data.taskName)
      }
    })
    this.taskTitles.splice(i, 1);
  }

  removeTask(task:any) {
    const index = this.taskNames.findIndex((data: any) => data.taskName === task)
    this.taskNames.splice(index, 1);
  }

  addTaskTitle() {
    if (this.taskTitleForm.valid) {
      this.taskTitles.push(this.taskTitleForm.value.taskTitleName);
      this.taskTitleForm.reset();
    }
  }

  addTask(taskTitle:any) {
    if (this.tasksForm.valid) {
      this.taskNames.push({
        organizationId: this.organizationId,
        onBoardingPlanId: "N/A",
        taskTitle: taskTitle,
        taskName: this.tasksForm.value.taskName,
        adminEmail: this.thisUser.email,
        description: "N/A",
        startdate: "N/A",
        taskdate: "N/A",
        closed: "N/A",
        status: "Open",
        monitoredBy: "N/A",
        activityNotes: "N/A",
        statusNotes: "N/A"
      });
      this.tasksForm.reset();
    }
  }

  filterTasksNames(title:any) {
    this.filteredTaskNames = this.taskNames.filter((data: any) => data.taskTitle === title)
    return this.filteredTaskNames;
  }

  saveAsTemplate() {
    this.onboardinService.saveOnboardingPlan({
      organizationId: this.receivedData.data.organizationId,
      empName: this.onboardinPlanForm.value.empName,
      empId: this.onboardinPlanForm.value.empId,
      empEmail: this.onboardinPlanForm.value.empEmail,
      title: this.onboardinPlanForm.value.titlePlan,
      department: this.onboardinPlanForm.value.departmentPlan,
      manager: this.onboardinPlanForm.value.managerPlan,
      startDate: this.onboardinPlanForm.value.startDatePlan,
      taskDate: this.onboardinPlanForm.value.endDatePlan,
      location: this.onboardinPlanForm.value.locationPlan,
      description: this.onboardinPlanForm.value.descriptionPlan,
      taskTitles: this.taskTitles,
      status: 'Open',
      template: 'yes'
    }).subscribe(data=>{
      this.submitTasks(data.message);
      this.closePopup();
      this.snackBar.open("Template Save!","Ok", {duration:3000})
    }, error => {
      console.log(error)
    })
  }

  patchValues() {
    this.onboardinPlanForm.get('empName')?.setValue(this.receivedData.data.userName);
    this.onboardinPlanForm.get('empId')?.setValue(this.receivedData.data.userId);
    this.onboardinPlanForm.get('empEmail')?.setValue(this.receivedData.data.userEmail);
    this.onboardinPlanForm.get('departmentPlan')?.setValue(this.receivedData.data.department);
    this.onboardinPlanForm.get('locationPlan')?.setValue(this.receivedData.data.location);
  }

  patchTemplateValues() {
    this.onboardinPlanForm.get('empName')?.setValue(this.receivedData.data.userName);
    this.onboardinPlanForm.get('empId')?.setValue(this.receivedData.data.userId);
    this.onboardinPlanForm.get('empEmail')?.setValue(this.receivedData.data.userEmail);
    this.onboardinPlanForm.get('titlePlan')?.setValue(this.receivedData.data.data.title);
    this.onboardinPlanForm.get('managerPlan')?.setValue(this.receivedData.data.data.manager);
    this.onboardinPlanForm.get('startDatePlan')?.setValue(this.receivedData.data.data.startDate);
    this.onboardinPlanForm.get('endDatePlan')?.setValue(this.receivedData.data.data.taskDate);
    this.onboardinPlanForm.get('descriptionPlan')?.setValue(this.receivedData.data.data.description);
    this.onboardinPlanForm.get('departmentPlan')?.setValue(this.receivedData.data.department);
    this.onboardinPlanForm.get('locationPlan')?.setValue(this.receivedData.data.location);

    if (this.receivedData.data.data.taskTitles) {
      this.taskTitles = this.receivedData.data.data.taskTitles
      this.loadAllTasks().subscribe(()=>{
        this.taskNames = this.filterLoadTasks(this.receivedData.data.data.id.toString())

        this.taskTitles.forEach((data: any) => {
          this.filterTasksNames(data)
        })
      })
    }
  }

  handleSearch(data: any): void {
    const dp = document.getElementById('nameDropdown') as HTMLElement;


    this.targetInput = data as HTMLInputElement;
    const value = this.targetInput.value
    if (value) {
      dp.style.display = 'block';
      this.filteredEmployees = this.employeeDataStore.filter((data: any) =>
        data.organizationId === this.organizationId && data.name.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      dp.style.display = 'block';
      this.filteredEmployees = this.employeeDataStore.filter((data: any) => data.organizationId === this.organizationId);
    }
  }

  handleManagerSearch(data: any): void {
    const dp = document.getElementById('managerDropdown') as HTMLElement;


    this.targetManagerInput = data as HTMLInputElement;
    const value = this.targetManagerInput.value
    if (value) {
      dp.style.display = 'block';
      this.filteredManagers = this.employeeDataStore.filter((data: any) =>
        data.organizationId === this.organizationId && data.level === 1 && data.name.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      dp.style.display = 'block';
      this.filteredManagers = this.employeeDataStore.filter((data: any) => data.organizationId === this.organizationId && data.level === 1);
    }
  }

  chooseName(employee:any) {
    this.onboardinPlanForm.get('empName')?.setValue(employee.name);
    this.onboardinPlanForm.get('empId')?.setValue(employee.id);
    this.onboardinPlanForm.get('empEmail')?.setValue(employee.email);
    this.onboardinPlanForm.get('departmentPlan')?.setValue(employee.jobData.department);
    this.onboardinPlanForm.get('locationPlan')?.setValue(employee.jobData.location);

    const dp = document.getElementById('nameDropdown') as HTMLElement;
    dp.style.display = 'none';
  }

  chooseManager(manager:any) {
    this.onboardinPlanForm.get('managerPlan')?.setValue(manager.name);
    const dp = document.getElementById('managerDropdown') as HTMLElement;
    dp.style.display = 'none';
  }
}
