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

    if (this.receivedData.data.leaveId != null){
      this.patchValue()
    }
  }

  closePopup(){
    this.dialog.closeAll()
  }

  patchValue(){
    this.leaveForm.get('leaveType')?.setValue(this.receivedData.data.leave.leaveType)
    this.leaveForm.get('reason')?.setValue(this.receivedData.data.leave.reason)
    this.leaveForm.get('startDate')?.setValue(this.receivedData.data.leave.leaveStartDate)
    this.leaveForm.get('endDate')?.setValue(this.receivedData.data.leave.leaveEndDate)
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

  editLeave() {
    if (this.leaveForm.valid){
      this.leaveService.saveLeave({
        id: this.receivedData.data.leave.id,
        organizationId:this.receivedData.data.organizationId,
        name:this.receivedData.data.employee.name,
        leaveType:this.leaveForm.value.leaveType,
        reason:this.leaveForm.value.reason,
        leaveStartDate:this.leaveForm.value.startDate,
        leaveEndDate:this.leaveForm.value.endDate,
        approved: "pending"
      }).subscribe(data=>{
        this.closePopup()
        this.snackBar.open("Leave requested Updated!", "OK", {duration:3000})
      }, error => {
        this.snackBar.open("Somethings wrong! Try again later", "OK", {duration:3000})
      })
    }
  }
}
