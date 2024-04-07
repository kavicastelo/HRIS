import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit{

  receivedData:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<ConfirmDialogComponent>) {
  }
  ngOnInit(): void {
    this.receivedData = this.data
  }

  closePopup() {
    this.ref.close('Closed using function');
  }

  discardChanges(){
    this.receivedData.data.reset();
    this.closePopup();
  }
}
