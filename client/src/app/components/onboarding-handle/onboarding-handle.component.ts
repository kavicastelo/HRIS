import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OnboardinService} from "../../services/onboardin.service";

@Component({
  selector: 'app-onboarding-handle',
  templateUrl: './onboarding-handle.component.html',
  styleUrls: ['./onboarding-handle.component.scss']
})
export class OnboardingHandleComponent implements OnInit{

  onboardinPlanForm = new FormGroup({
    titlePlan: new FormControl(null, [Validators.required]),
    descriptionPlan: new FormControl(null, [Validators.required]),
    startDatePlan: new FormControl(null, [Validators.required]),
    endDatePlan: new FormControl(null, [Validators.required])
  })

  onboardinTaskForm = new FormGroup({
    onboardingPlanId: new FormControl(null, [Validators.required]),
    adminEmailTask: new FormControl(null, [Validators.required]),
    descriptionTask: new FormControl(null, [Validators.required]),
    startDateTask: new FormControl(null, [Validators.required]),
    endDateTask: new FormControl(null, [Validators.required]),
    statusTask: new FormControl(null, [Validators.required])
  })

  constructor(private onboardinService: OnboardinService) {
  }

  ngOnInit(): void {
  }

  submitPlan(){
    if (this.onboardinPlanForm.valid){
      this.onboardinService.saveOnboardingPlan({
        title: this.onboardinPlanForm.value.titlePlan,
        description: this.onboardinPlanForm.value.descriptionPlan,
        startDate: this.onboardinPlanForm.value.startDatePlan,
        taskDate: this.onboardinPlanForm.value.endDatePlan
      }).subscribe(data=>{
        console.log(data)
      }, error => {
        console.log(error)
      })
    }
  }

  submitTask(){
    if (this.onboardinTaskForm.valid){
      this.onboardinService.saveOnboardin({
        onBoardingPlanId: this.onboardinTaskForm.value.onboardingPlanId,
        adminEmail: this.onboardinTaskForm.value.adminEmailTask,
        description: this.onboardinTaskForm.value.descriptionTask,
        startdate: this.onboardinTaskForm.value.startDateTask,
        taskdate: this.onboardinTaskForm.value.endDateTask,
        status: this.onboardinTaskForm.value.statusTask,
      }).subscribe(data=>{
        console.log(data)
      }, error => {
        console.log(error)
      })
    }
  }

}
