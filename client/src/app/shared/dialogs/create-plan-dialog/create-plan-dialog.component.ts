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

@Component({
  selector: 'app-create-plan-dialog',
  templateUrl: './create-plan-dialog.component.html',
  styleUrls: ['./create-plan-dialog.component.scss']
})
export class CreatePlanDialogComponent {

  receivedData:any;
  planDataStore:any[] = [];
  employeeDataStore:any[] = [];

  taskTitles: any[] = [];

  onboardinPlanForm = new FormGroup({
    empName: new FormControl('', [Validators.required]),
    empId: new FormControl('', [Validators.required]),
    empEmail: new FormControl('', [Validators.required]),
    titlePlan: new FormControl('', [Validators.required]),
    departmentPlan: new FormControl('', [Validators.required]),
    managerPlan: new FormControl('', [Validators.required]),
    startDatePlan: new FormControl('', [Validators.required]),
    endDatePlan: new FormControl('', [Validators.required]),
    locationPlan: new FormControl('', [Validators.required]),
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
              private onboardinService: OnboardinService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<CreatePlanDialogComponent>) {
  }

  async ngOnInit(): Promise<any> {
    this.receivedData = this.data;

    await this.loadAllUsers().subscribe(()=>{})
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
    this.employeeDataStore = this.employeeDataStore.filter((data:any) => data.organizationId == this.receivedData.data.organizationId? this.employeeDataStore = [data]: this.employeeDataStore = [])

    return this.employeeDataStore;
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
        taskTitles: this.taskTitles
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
}
