import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TransferRequestService} from "../../../services/transfer-request.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-post-image',
  templateUrl: './empty-dialog.component.html',
  styleUrls: ['./empty-dialog.component.scss']
})
export class EmptyDialogComponent implements OnInit {

  receivedData:any;

  constructor(private transferService: TransferRequestService, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<EmptyDialogComponent>) {
  }

  ngOnInit(): void {
    this.receivedData = this.data
  }
}
