import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../../../services/auth.service";
import {OnboardinService} from "../../../services/onboardin.service";
import {tap} from "rxjs";

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

}
