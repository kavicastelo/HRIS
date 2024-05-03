import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MultimediaService} from "../../../services/multimedia.service";

@Component({
  selector: 'app-request-leave',
  templateUrl: './request-leave.component.html',
  styleUrls: ['./request-leave.component.scss']
})
export class RequestLeaveComponent implements OnInit{

  receivedData:any;
  selectedLeave:any;
  leaveTypes:any = ["ANNUAL", "SICK", "MATERNITY", "PATERNITY", "UNPAID"]

  constructor(private multimediaService: MultimediaService,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<RequestLeaveComponent>) {
  }

  ngOnInit() {
    this.receivedData = this.data;
  }

  closePopup(){
    this.dialog.closeAll()
  }
}
