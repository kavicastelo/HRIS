import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TransferRequestService} from "../../../services/transfer-request.service";
import {PromotionRequestService} from "../../../services/promotion-request.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

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
    ])
  })

  constructor(private transferRequestService: TransferRequestService, private promotionRequestService: PromotionRequestService, @Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<ChangeJobDataDialogComponent>) {
  }
  ngOnInit(): void {
    this.receivedData = this.data

    if(this.receivedData.data.id){
      this.textForm.get('text1')?.patchValue(this.receivedData.data.jobData.position)
      this.textForm.get('text2')?.patchValue(this.receivedData.data.jobData.department)
      this.textForm.get('text3')?.patchValue(this.receivedData.data.jobData.salary)
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
  }
}
