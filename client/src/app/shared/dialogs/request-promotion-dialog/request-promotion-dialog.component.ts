import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {EmptyDialogComponent} from "../empty-dialog/empty-dialog.component";
import {PromotionRequestService} from "../../../services/promotion-request.service";

@Component({
  selector: 'app-request-promotion-dialog',
  templateUrl: './request-promotion-dialog.component.html',
  styleUrls: ['./request-promotion-dialog.component.scss']
})
export class RequestPromotionDialogComponent {

  receivedData:any;

  textAreaForm = new FormGroup({
    text: new FormControl('',[
      Validators.required,
      Validators.maxLength(1000)
    ])
  })

  constructor(private promotionService: PromotionRequestService, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<RequestPromotionDialogComponent>) {
  }
  ngOnInit(): void {
    this.receivedData = this.data

    if (this.receivedData.data.approved == 'pending'){
      this.textAreaForm.get('text')?.patchValue(this.receivedData.data.text)
    }
  }

  closePopup() {
    this.ref.close('Closed using function');
  }

  saveRequest() {
    if (this.receivedData){
      this.promotionService.savePromotion({
        userId: this.receivedData.data.userId,
        organizationId: this.receivedData.data.organizationId,
        timestamp: new Date(),
        reason: this.textAreaForm.value.text
      }).subscribe((data)=>{
        this.closePopup();
        this.toggleDialog('','', data, EmptyDialogComponent)
      }, error => {
        console.log(error)
      })
    }
  }

  editRequest() {
    this.promotionService.editPromotion(this.receivedData.data.id, this.textAreaForm.value.text).subscribe(()=>{
      this.closePopup();
    }, error => {
      console.log(error)
    })
  }

  toggleDialog(title: any, msg: any, data: any, component: any) {
    const _popup = this.dialog.open(component, {
      width: '350px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        data: data,
        title: title,
        msg: msg
      }
    });
    _popup.afterClosed().subscribe(item => {
      //TODO: do something
    })
  }
}
