import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MultimediaService} from "../../../services/multimedia.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {OnboardinService} from "../../../services/onboardin.service";
import {DepartmentService} from "../../../services/department.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-create-department-dialog',
  templateUrl: './create-department-dialog.component.html',
  styleUrls: ['./create-department-dialog.component.scss']
})
export class CreateDepartmentDialogComponent {

  receivedData:any;

  onboardinPlanForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required])
  })

  constructor(private multimediaService: MultimediaService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private departmentService: DepartmentService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<CreateDepartmentDialogComponent>) {
  }

  ngOnInit(): void {
    this.receivedData = this.data;
  }

  closePopup(){
    this.dialog.closeAll()
  }

  submitPlan(){
    if (this.onboardinPlanForm.valid){
      this.departmentService.addDepartment({
        name: this.onboardinPlanForm.value.name,
        description: this.onboardinPlanForm.value.description,
        organizationId: this.receivedData.data.organizationId
      }).subscribe(data=>{
        this.closePopup();
        this.snackBar.open("New Department Create!","Ok", {duration:3000})
      }, error => {
        console.log(error)
      })
    }
  }
}
