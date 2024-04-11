import {Component, Inject} from '@angular/core';
import {MultimediaService} from "../../../services/multimedia.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-text-dialog',
  templateUrl: './edit-text-dialog.component.html',
  styleUrls: ['./edit-text-dialog.component.scss']
})
export class EditTextDialogComponent {

  receivedData:any;

  textAreaForm = new FormGroup({
    text: new FormControl('',[
        Validators.required,
        Validators.maxLength(1000)
    ])
  })

  constructor(private multimediaService: MultimediaService, @Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<EditTextDialogComponent>) {
  }
  ngOnInit(): void {
    this.receivedData = this.data
  }

  closePopup() {
    this.ref.close('Closed using function');
  }

  save() {
    let data: any = {
      title: null,
      sharedUserCaption:null
    };
    if (this.receivedData.data.isShared){
      data.sharedUserCaption = this.textAreaForm.value.text + '⚬ ♦ Edited'
    }
    else {
      data.title = this.textAreaForm.value.text + '⚬ ♦ Edited'
    }
    this.multimediaService.updatePostCaption(this.receivedData.data.id, data).subscribe(data => {
      this.closePopup();
    },error => {
      console.log(error)
    })
  }
}
