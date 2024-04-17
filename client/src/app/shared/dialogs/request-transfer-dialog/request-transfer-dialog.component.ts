import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TransferRequestService} from "../../../services/transfer-request.service";

@Component({
  selector: 'app-request-transfer-model',
  templateUrl: './request-transfer-dialog.component.html',
  styleUrls: ['./request-transfer-dialog.component.scss']
})
export class RequestTransferDialogComponent {

  receivedData:any;

  textAreaForm = new FormGroup({
    text: new FormControl('',[
      Validators.required,
      Validators.maxLength(1000)
    ])
  })

  constructor(private transferService: TransferRequestService, @Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<RequestTransferDialogComponent>) {
  }
  ngOnInit(): void {
    this.receivedData = this.data
  }

  closePopup() {
    this.ref.close('Closed using function');
  }

  saveRequest() {
    if (this.receivedData){
      this.transferService.saveTransfer({
        userId: this.receivedData.data.userId,
        timestamp: new Date(),
        reason: this.textAreaForm.value.text
      }).subscribe((data)=>{
        this.closePopup();
      }, error => {
        console.log(error)
      })
    }
  }

  editRequest() {

  }
}
