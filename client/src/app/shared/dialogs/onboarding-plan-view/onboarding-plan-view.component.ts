import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../../../services/auth.service";
import {OnboardinService} from "../../../services/onboardin.service";
import {tap} from "rxjs";
import {CreatePlanDialogComponent} from "../create-plan-dialog/create-plan-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-onboarding-plan-view',
  templateUrl: './onboarding-plan-view.component.html',
  styleUrls: ['./onboarding-plan-view.component.scss']
})
export class OnboardingPlanViewComponent implements OnInit {

  receivedData: any;

  organizationId: any;
  thisUserId: any;

  onboardingPlans: any[] = [];
  filteredOnboardingPlans: any[] = [];
  onBoardingTasks: any[] = [];
  filteredOnBoardingTasks: any[] = [];

  constructor(private dialog: MatDialog,
              private cookieService: AuthService,
              private snackBar: MatSnackBar,
              private onboardingService: OnboardinService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<OnboardingPlanViewComponent>) {
  }

  async ngOnInit(): Promise<any> {
    this.receivedData = this.data
    this.organizationId = this.cookieService.organization().toString();

    await this.loadAllOnboardingPlans().subscribe(() => {
      this.filterOnboardingPlans();
    })

    await this.loadAllOnBoardingTasks().subscribe(() => {
      this.filterOnBoardingTasks(undefined);
    })
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

  editTasks() {
    //TODO: edit tasks
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
      //TODO: load all onboarding plans
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
}
