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

  receivedData:any;
  planDataStore:any[] = [];
  employeeDataStore:any[] = [];
  filteredEmployees:any[] = [];
  filteredManagers:any[] = [];

  taskTitles: any[] = [];

  organizationId: any;
  targetInput:any;
  targetManagerInput:any;

  onboardinPlanForm = new FormGroup({
    empName: new FormControl('', [Validators.required]),
    empId: new FormControl({value:'', disabled: true}, [Validators.required]),
    empEmail: new FormControl({value:'', disabled: true}),
    titlePlan: new FormControl('', [Validators.required]),
    departmentPlan: new FormControl({value:'', disabled: true}, [Validators.required]),
    managerPlan: new FormControl('', [Validators.required]),
    startDatePlan: new FormControl('', [Validators.required]),
    endDatePlan: new FormControl('', [Validators.required]),
    locationPlan: new FormControl({value:'', disabled: true}),
    descriptionPlan: new FormControl('', [Validators.required]),
  })

  taskTitleForm = new FormGroup({
    taskTitleName: new FormControl('', [Validators.required])
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

    await this.loadAllUsers().subscribe(()=>{})

    if (this.receivedData.data.userId){
      this.patchValues()
    } else if (this.receivedData.data.id){
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

  removeTaskTitle(i: number) {
    this.taskTitles.splice(i, 1);
  }

  addTaskTitle() {
    if (this.taskTitleForm.valid) {
      this.taskTitles.push(this.taskTitleForm.value.taskTitleName);
      this.taskTitleForm.reset();
    }
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
    this.onboardinPlanForm.get('titlePlan')?.setValue(this.receivedData.data.title);
    this.onboardinPlanForm.get('managerPlan')?.setValue(this.receivedData.data.manager);
    this.onboardinPlanForm.get('startDatePlan')?.setValue(this.receivedData.data.startDate);
    this.onboardinPlanForm.get('endDatePlan')?.setValue(this.receivedData.data.taskDate);
    this.onboardinPlanForm.get('descriptionPlan')?.setValue(this.receivedData.data.description);
    this.onboardinPlanForm.get('departmentPlan')?.setValue(this.receivedData.data.department);
    this.onboardinPlanForm.get('locationPlan')?.setValue(this.receivedData.data.location);

    if (this.receivedData.data.taskTitles) {
      this.taskTitles = this.receivedData.data.taskTitles
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
