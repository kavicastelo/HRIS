import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OnboardinService} from "../../../services/onboardin.service";
import {EmployeesService} from "../../../services/employees.service";
import {AuthService} from "../../../services/auth.service";
import {forkJoin, Observable, tap} from "rxjs";

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent {

  organizationId:any;


  onboardinTaskForm = new FormGroup({
    onboardingPlanId: new FormControl(null, [Validators.required]),
    adminEmailTask: new FormControl(null, [Validators.required]),
    descriptionTask: new FormControl(null, [Validators.required]),
    startDateTask: new FormControl(null, [Validators.required]),
    endDateTask: new FormControl(null, [Validators.required]),
    statusTask: new FormControl(null, [Validators.required])
  })

  constructor(private onboardinService: OnboardinService, private employeeService: EmployeesService, private cookiesService: AuthService) {
  }

  ngOnInit(): void {
    this.organizationId = this.cookiesService.organization();
  }

  submitTask(){
    if (this.onboardinTaskForm.valid){
      this.onboardinService.saveOnboardin({
        organizationId: this.organizationId,
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
