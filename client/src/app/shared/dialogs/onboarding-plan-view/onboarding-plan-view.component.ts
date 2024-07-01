import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../../../services/auth.service";
import {OnboardinService} from "../../../services/onboardin.service";
import {tap} from "rxjs";
import {CreatePlanDialogComponent} from "../create-plan-dialog/create-plan-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CreateTaskDialogComponent} from "../create-task-dialog/create-task-dialog.component";
import {OnboardingTaskViewComponent} from "../onboarding-task-view/onboarding-task-view.component";
import {EmployeesService} from "../../../services/employees.service";

@Component({
  selector: 'app-onboarding-plan-view',
  templateUrl: './onboarding-plan-view.component.html',
  styleUrls: ['./onboarding-plan-view.component.scss']
})
export class OnboardingPlanViewComponent implements OnInit {

  receivedData: any;

  organizationId: any;
  thisUserId: any;
  employeeDataStore: any[] = [];
  thisUser: any = {
    level: ''
  };

  onboardingPlans: any[] = [];
  filteredOnboardingPlans: any[] = [];
  onBoardingTasks: any[] = [];
  filteredOnBoardingTasks: any[] = [];

  constructor(private dialog: MatDialog,
              private cookieService: AuthService,
              private snackBar: MatSnackBar,
              private employeeService: EmployeesService,
              private onboardingService: OnboardinService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<OnboardingPlanViewComponent>) {
  }

  async ngOnInit(): Promise<any> {
    this.receivedData = this.data
    this.organizationId = this.cookieService.organization().toString();
    this.thisUserId = this.cookieService.userID().toString();

    await this.loadAllOnboardingPlans().subscribe(() => {
      this.filterOnboardingPlans();
    })

    await this.loadAllOnBoardingTasks().subscribe(() => {
      this.filterOnBoardingTasks(undefined);
    })

    await this.loadAllEmployees().subscribe(() => {
      this.getUser();
    })
  }

  loadAllEmployees() {
    return this.employeeService.getAllEmployees().pipe(
      tap(data => this.employeeDataStore = data)
    )
  }

  getUser() {
    return this.thisUser = this.employeeDataStore.find((emp: any) => emp.id === this.thisUserId);
  }

  loadAllOnboardingPlans() {
    return this.onboardingService.getAllPlans().pipe(
      tap(data => this.onboardingPlans = data)
    )
  }

  filterOnboardingPlans() {
    this.filteredOnboardingPlans = this.onboardingPlans.filter((data: any) => data.organizationId === this.organizationId && data.id == this.receivedData.data.id);
    return this.filteredOnboardingPlans;
  }

  loadAllOnBoardingTasks() {
    return this.onboardingService.getAllTasks().pipe(
      tap(data => this.onBoardingTasks = data)
    )
  }

  filterOnBoardingTasks(title: any) {
    this.filteredOnBoardingTasks = this.onBoardingTasks.filter((data: any) => data.organizationId === this.organizationId && data.onBoardingPlanId === this.receivedData.data.id && data.taskTitle == title);

    return this.filteredOnBoardingTasks
  }

  closePopup() {
    this.dialog.closeAll()
  }

  EditPlan() {
    const data = {
      organizationId: this.organizationId,
      id: this.receivedData.data.id,
      userId: this.receivedData.data.empId,
      userName: this.receivedData.data.empName,
      userEmail: this.receivedData.data.empEmail,
      department: this.receivedData.data.department,
      location: this.receivedData.data.location,
      data:this.receivedData.data
    }
    this.toggleDialog('', '', data, CreatePlanDialogComponent)
  }

  changeStatus(id: any, status: any) {
    if (id) {
      if (confirm(`Are you sure you want to ${status == 'Open'?'Closed':'Open'} this plan?`)) {
        this.onboardingService.updatePlanStatus(id).subscribe(() => {
          this.closePopup();
          this.snackBar.open(`Plan Marked as ${status == 'Open'?'Closed':'Open'}`, 'Close', {
            duration: 3000
          })
        })
      }
    }
  }

  toggleDialog(title: any, msg: any, data: any, component: any) {
    const _popup = this.dialog.open(component, {
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '500ms',
      maxHeight: '80vh',
      data: {
        data: data,
        title: title,
        msg: msg
      }
    });
    _popup.afterClosed().subscribe(item => {
      this.loadAllOnboardingPlans().subscribe(() => {
        this.filterOnboardingPlans();
      })

      this.loadAllOnBoardingTasks().subscribe(() => {
        this.filterOnBoardingTasks(undefined);
      })
    })
  }

  deletePlan() {
    if (this.receivedData.data.id){
      if (confirm('Are you sure you want to delete this plan?')) {
        this.onboardingService.deleteOnboardingPlan(this.receivedData.data.id).subscribe(() => {
          this.closePopup();
          this.snackBar.open('Plan deleted successfully', 'Close', {
            duration: 3000
          })
        })
      }
    }
  }

  editTask(t: any, p: any) {
    const data = {
      taskId: t.id,
      planId: p.id,
      task: t,
      plan: p
    }

    this.toggleDialog('', '', data, OnboardingTaskViewComponent)
  }
}
