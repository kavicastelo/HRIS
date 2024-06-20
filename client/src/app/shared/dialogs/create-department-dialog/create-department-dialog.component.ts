import {Component, Inject, Renderer2} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MultimediaService} from "../../../services/multimedia.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {OnboardinService} from "../../../services/onboardin.service";
import {DepartmentService} from "../../../services/department.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatSelect} from "@angular/material/select";

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
              private renderer: Renderer2,
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
}
