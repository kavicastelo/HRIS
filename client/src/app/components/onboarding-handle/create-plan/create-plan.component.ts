import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OnboardinService} from "../../../services/onboardin.service";
import {EmployeesService} from "../../../services/employees.service";
import {AuthService} from "../../../services/auth.service";
import {forkJoin, Observable, tap} from "rxjs";

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.scss']
})
export class CreatePlanComponent {

  planDataStore:any[] = [];
  organizationId:any;

  onboardinPlanForm = new FormGroup({
    titlePlan: new FormControl(null, [Validators.required]),
    descriptionPlan: new FormControl(null, [Validators.required]),
    startDatePlan: new FormControl(null, [Validators.required]),
    endDatePlan: new FormControl(null, [Validators.required])
  })

  constructor(private onboardinService: OnboardinService, private employeeService: EmployeesService, private cookiesService: AuthService) {
  }

  ngOnInit(): void {
    this.organizationId = this.cookiesService.organization();
  }

  submitPlan(){
    if (this.onboardinPlanForm.valid){
      this.onboardinService.saveOnboardingPlan({
        title: this.onboardinPlanForm.value.titlePlan,
        organizationId: this.organizationId,
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
}
