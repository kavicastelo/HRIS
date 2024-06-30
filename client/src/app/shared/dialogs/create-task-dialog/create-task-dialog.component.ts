import {Component, Inject, Renderer2} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OnboardinService} from "../../../services/onboardin.service";
import {MultimediaService} from "../../../services/multimedia.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Observable, tap} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationsService} from "../../../services/notifications.service";
import {EmployeesService} from "../../../services/employees.service";
import {MatSelect} from "@angular/material/select";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.scss']
})
export class CreateTaskDialogComponent {

  receivedData:any;
  selectedStatus:any;
  selectedCloseStatus:any;
  statusTypes:any[] = ["Open", "In Progress", "On Hold", "Pending Review", "Completed", "Canceled", "Reopened"]

  plansStore: any[] = [];
  employeeDataStore:any[] = [];


  thisUser:any;
  thisUserId:any;


  onboardinTaskForm = new FormGroup({
    nameTask: new FormControl(null, [Validators.required]),
    adminEmail: new FormControl({value: null, disabled: true}, [Validators.required]),
    startDateTask: new FormControl(null, [Validators.required]),
    endDateTask: new FormControl(null, [Validators.required]),
    close: new FormControl(null, [Validators.required]),
    statusTask: new FormControl(null, [Validators.required]),
    monitorBy: new FormControl(null, [Validators.required]),
    descriptionTask: new FormControl(null, [Validators.required]),
    activityNotes: new FormControl("N/A"),
    statusNotes: new FormControl("N/A"),
  })

  constructor(private multimediaService: MultimediaService,
              private dialog: MatDialog,
              private onboardinService: OnboardinService,
              private snackbar: MatSnackBar,
              private cookieService: AuthService,
              private renderer: Renderer2,
              private employeesService: EmployeesService,
              private notificationsService: NotificationsService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<CreateTaskDialogComponent>) {
  }

  async ngOnInit(): Promise<any> {
    this.receivedData = this.data;
    this.thisUserId = this.cookieService.userID().toString();

    await this.loadAllPlans().subscribe(()=>{})
    await this.loadAllUsers().subscribe(()=>{
      this.getCurrentUser()
    })
    this.patchValues();
  }

  loadAllPlans(): Observable<any> {
    return this.onboardinService.getAllPlans().pipe(
        tap(data => this.plansStore = data)
    );
  }

  loadAllUsers(): Observable<any> {
    return this.employeesService.getAllEmployees().pipe(
        tap(data => this.employeeDataStore = data)
    );
  }

  getCurrentUser(): Observable<any> {
    return this.thisUser = this.employeeDataStore.find((emp: any) => emp.id === this.thisUserId);
  }

  filterEmployees(): any[]{
    this.employeeDataStore = this.employeeDataStore.filter((data:any) => data.organizationId == this.receivedData.data.organizationId? this.employeeDataStore = [data]: this.employeeDataStore = [])

    return this.employeeDataStore;
  }

  closePopup(){
    this.dialog.closeAll()
  }

  patchValues(){
    if (this.receivedData.data.taskId){
      this.selectedStatus = this.receivedData.data.task.status
      this.selectedCloseStatus = this.receivedData.data.task.closed
      this.onboardinTaskForm.get('nameTask')?.setValue(this.receivedData.data.task.taskName)
      this.onboardinTaskForm.get('adminEmail')?.setValue(this.receivedData.data.task.adminEmail)
      this.onboardinTaskForm.get('startDateTask')?.setValue(this.receivedData.data.task.startdate)
      this.onboardinTaskForm.get('endDateTask')?.setValue(this.receivedData.data.task.taskdate)
      this.onboardinTaskForm.get('close')?.setValue(this.receivedData.data.task.closed)
      this.onboardinTaskForm.get('statusTask')?.setValue(this.receivedData.data.task.status)
      this.onboardinTaskForm.get('monitorBy')?.setValue(this.receivedData.data.task.monitoredBy)
      this.onboardinTaskForm.get('descriptionTask')?.setValue(this.receivedData.data.task.description)
      this.onboardinTaskForm.get('activityNotes')?.setValue(this.receivedData.data.task.activityNotes)
      this.onboardinTaskForm.get('statusNotes')?.setValue(this.receivedData.data.task.statusNotes)
    }
  }

  submitTask(){
    if (this.onboardinTaskForm.valid){
      this.onboardinService.saveOnboardin({
        organizationId: this.receivedData.data.organizationId,
        onBoardingPlanId: this.receivedData.data.task.onBoardingPlanId,
        taskTitle: this.receivedData.data.task.taskTitle,
        taskName: this.onboardinTaskForm.value.nameTask,
        adminEmail: this.receivedData.data.task.adminEmail,
        description: this.onboardinTaskForm.value.descriptionTask,
        startdate: this.onboardinTaskForm.value.startDateTask,
        taskdate: this.onboardinTaskForm.value.endDateTask,
        closed: this.onboardinTaskForm.value.close,
        status: this.onboardinTaskForm.value.statusTask,
        monitoredBy: this.onboardinTaskForm.value.monitorBy,
        activityNotes: this.onboardinTaskForm.value.activityNotes,
        statusNotes: this.onboardinTaskForm.value.statusNotes
      }).subscribe(data=>{
        this.closePopup()
        this.snackbar.open("Please wait a moment...!");
        this.filterEmployees().forEach((emp)=>{
          const notificationData = {
            userId: emp.id,
            notification: this.thisUser.name + ` created a new task under the ${this.receivedData.data.task.taskTitle} topic`,
            timestamp: new Date(),
            router: '/onboardin/task',
            status: true
          }

          this.pushNotification(notificationData);
        })
        this.snackbar.dismiss();
        this.snackbar.open("Task Created Successfully", "OK", {duration:3000})
      }, error => {
        console.log(error)
      })
    }
  }

  editTask() {
    if (this.receivedData.data.taskId){
      this.onboardinService.editTaskById(this.receivedData.data.taskId, {
        organizationId: this.receivedData.data.organizationId,
        onBoardingPlanId: this.receivedData.data.task.onBoardingPlanId,
        taskTitle: this.receivedData.data.task.taskTitle,
        taskName: this.onboardinTaskForm.value.nameTask,
        adminEmail: this.receivedData.data.task.adminEmail,
        description: this.onboardinTaskForm.value.descriptionTask,
        startdate: this.onboardinTaskForm.value.startDateTask,
        taskdate: this.onboardinTaskForm.value.endDateTask,
        closed: this.onboardinTaskForm.value.close,
        status: this.onboardinTaskForm.value.statusTask,
        monitoredBy: this.onboardinTaskForm.value.monitorBy,
        activityNotes: this.onboardinTaskForm.value.activityNotes,
        statusNotes: this.onboardinTaskForm.value.statusNotes
      }).subscribe(data => {
        this.closePopup()
        this.snackbar.open("Please wait a moment...!");
        this.filterEmployees().forEach((emp)=>{
          const notificationData = {
            userId: emp.id,
            notification: this.thisUser.name + ` updated the task- ${this.receivedData.data.taskName} under ${this.receivedData.data.task.taskTitle} topic`,
            timestamp: new Date(),
            router: '/onboardin/task',
            status: true
          }

          this.pushNotification(notificationData);
        })
        this.snackbar.dismiss();
        this.snackbar.open("Task Edited Successfully", "OK", {duration:3000})
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
      if (method == 'create') {
        this.submitTask()
      } else if (method == 'edit') {
        this.editTask()
      }
    }
  }
}
