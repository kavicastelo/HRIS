import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MultimediaService} from "../../../services/multimedia.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LeaveService} from "../../../services/leave.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-request-leave',
  templateUrl: './request-leave.component.html',
  styleUrls: ['./request-leave.component.scss']
})
export class RequestLeaveComponent implements OnInit{

  receivedData:any;
  selectedLeave:any;
  leaveTypes:any = ["ANNUAL", "SICK", "MATERNITY", "PATERNITY", "UNPAID"]

  leaveForm = new FormGroup({
    leaveType: new FormControl(null, [Validators.required]),
    reason: new FormControl(null, [Validators.required]),
    startDate: new FormControl(null, [Validators.required]),
    endDate: new FormControl(null, [Validators.required])
  })

  constructor(private multimediaService: MultimediaService,
              private dialog: MatDialog,
              private leaveService: LeaveService,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<RequestLeaveComponent>) {
  }

  ngOnInit() {
    this.receivedData = this.data;
  }

  closePopup(){
    this.dialog.closeAll()
  }

  submitLeave() {
    if (this.leaveForm.valid){
      this.leaveService.saveLeave({
        organizationId:this.receivedData.data.organizationId,
        name:this.receivedData.data.employee.name,
        leaveType:this.leaveForm.value.leaveType,
        reason:this.leaveForm.value.reason,
        leaveStartDate:this.leaveForm.value.startDate,
        leaveEndDate:this.leaveForm.value.endDate,
        approved: "pending"
      }).subscribe(data=>{
        this.closePopup()
        this.snackBar.open("Leave requested Successfully!", "OK", {duration:3000})
      }, error => {
        this.snackBar.open("Somethings wrong! Try again later", "OK", {duration:3000})
      })
    }
  }
}
