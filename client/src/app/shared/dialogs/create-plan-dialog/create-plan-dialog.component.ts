import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OnboardinService} from "../../../services/onboardin.service";
import {EmployeesService} from "../../../services/employees.service";
import {AuthService} from "../../../services/auth.service";
import {MultimediaService} from "../../../services/multimedia.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {LeaveService} from "../../../services/leave.service";

@Component({
  selector: 'app-create-plan-dialog',
  templateUrl: './create-plan-dialog.component.html',
  styleUrls: ['./create-plan-dialog.component.scss']
})
export class CreatePlanDialogComponent {

  receivedData:any;
  planDataStore:any[] = [];

  onboardinPlanForm = new FormGroup({
    titlePlan: new FormControl(null, [Validators.required]),
    descriptionPlan: new FormControl(null, [Validators.required]),
    startDatePlan: new FormControl(null, [Validators.required]),
    endDatePlan: new FormControl(null, [Validators.required])
  })

  constructor(private multimediaService: MultimediaService,
              private dialog: MatDialog,
              private onboardinService: OnboardinService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<CreatePlanDialogComponent>) {
  }

  ngOnInit(): void {
    this.receivedData = this.data;
  }

  closePopup(){
    this.dialog.closeAll()
  }

  submitPlan(){
    if (this.onboardinPlanForm.valid){
      this.onboardinService.saveOnboardingPlan({
        title: this.onboardinPlanForm.value.titlePlan,
        organizationId: this.receivedData.data.organizationId,
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
