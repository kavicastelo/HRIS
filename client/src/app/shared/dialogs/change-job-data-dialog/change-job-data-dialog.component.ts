import {Component, Inject, Renderer2} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TransferRequestService} from "../../../services/transfer-request.service";
import {PromotionRequestService} from "../../../services/promotion-request.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSelect} from "@angular/material/select";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-change-job-data-dialog',
  templateUrl: './change-job-data-dialog.component.html',
  styleUrls: ['./change-job-data-dialog.component.scss']
})
export class ChangeJobDataDialogComponent {

  receivedData:any;

  textForm = new FormGroup({
    text1: new FormControl('',[
        Validators.required
    ]),
    text2: new FormControl('',[
      Validators.required
    ]),
    text3: new FormControl('',[
      Validators.required
    ]),
    text4: new FormControl('',[
      Validators.required
    ]),
    text5: new FormControl('',[
      Validators.required
    ]),
    text6: new FormControl('',[
      Validators.required
    ]),
    text7: new FormControl('',[
      Validators.required
    ]),
    text8: new FormControl('',[
      Validators.required
    ]),
    text9: new FormControl('',[
      Validators.required
    ]),
    text10: new FormControl('',[
      Validators.required
    ]),
  })

  constructor(private transferRequestService: TransferRequestService,
              private promotionRequestService: PromotionRequestService,
              private snackBar: MatSnackBar,
              private renderer: Renderer2,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<ChangeJobDataDialogComponent>) {
  }
  ngOnInit(): void {
    this.receivedData = this.data

    if(this.receivedData.data.id){
      this.textForm.get('text1')?.patchValue(this.receivedData.data.jobData.position)
      this.textForm.get('text2')?.patchValue(this.receivedData.data.jobData.department)
      this.textForm.get('text3')?.patchValue(this.receivedData.data.jobData.salary)
      this.textForm.get('text4')?.patchValue(this.receivedData.data.jobData.employementType)
      this.textForm.get('text5')?.patchValue(this.receivedData.data.jobData.jobGrade)
      this.textForm.get('text6')?.patchValue(this.receivedData.data.jobData.personalGrade)
      this.textForm.get('text7')?.patchValue(this.receivedData.data.jobData.supervisor)
      this.textForm.get('text8')?.patchValue(this.receivedData.data.jobData.businessUnit)
      this.textForm.get('text9')?.patchValue(this.receivedData.data.jobData.location)
      this.textForm.get('text10')?.patchValue(this.receivedData.data.jobData.branch)
    }

  }

  closePopup() {
    this.ref.close('Closed using function');
  }

  confirm() {
    const data:any ={
      position:this.textForm.value.text1,
      department:this.textForm.value.text2,
      salary:this.textForm.value.text3,
      doj:this.receivedData.data.jobData.doj
    }
    if (this.receivedData.data.type == 'transfer'){
      this.transferRequestService.changeStatus(this.receivedData.data.id,{
        jobData: data,
        approved: "approved"
      }).subscribe(data => {
        this.closePopup()

      }, error => {
        console.log(error)
      })
    }
    else if (this.receivedData.data.type == 'promotion'){
      this.promotionRequestService.changeStatus(this.receivedData.data.id,{
        jobData: data,
        approved: "approved"
      }).subscribe(data => {
        this.closePopup()
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
        this.confirm()
      }
    }
  }
}
