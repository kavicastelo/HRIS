import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MultimediaService} from "../../../services/multimedia.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {LeaveService} from "../../../services/leave.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-approve-leave',
  templateUrl: './approve-leave.component.html',
  styleUrls: ['./approve-leave.component.scss']
})
export class ApproveLeaveComponent {

  receivedData:any;

  leaveForm = new FormGroup({
    name: new FormControl(null),
    leaveType: new FormControl(null),
    reason: new FormControl(null),
    startDate: new FormControl(new Date()),
    endDate: new FormControl(new Date())
  })

  constructor(private multimediaService: MultimediaService,
              private dialog: MatDialog,
              private leaveService: LeaveService,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<ApproveLeaveComponent>) {
  }

  ngOnInit() {
    this.receivedData = this.data;
    this.patchValues()
  }

  patchValues(){
    if (this.receivedData.data){
      this.leaveForm.get('name')?.setValue(this.receivedData.data.user.name)
      this.leaveForm.get('leaveType')?.setValue(this.receivedData.data.leave.leaveType)
      this.leaveForm.get('reason')?.setValue(this.receivedData.data.leave.reason)
      this.leaveForm.get('startDate')?.setValue(new Date(this.receivedData.data.leave.leaveStartDate))
      this.leaveForm.get('endDate')?.setValue(new Date(this.receivedData.data.leave.leaveEndDate))
    }
  }

  closePopup(){
    this.dialog.closeAll()
  }

  approveLeave() {
    if (this.leaveForm.valid){
      this.leaveService.saveLeave({
        id: this.receivedData.data.leave.id,
        organizationId:this.receivedData.data.leave.organizationId,
        name:this.receivedData.data.leave.name,
        leaveType:this.receivedData.data.leave.leaveType,
        reason:this.receivedData.data.leave.reason,
        leaveStartDate:this.receivedData.data.leave.leaveStartDate,
        leaveEndDate:this.receivedData.data.leave.leaveEndDate,
        approved: "approved",
        approver: this.receivedData.data.user.name
      }).subscribe(data=>{
        this.closePopup()
        this.snackBar.open("Leave request Approved!", "OK", {duration:3000})
      }, error => {
        this.snackBar.open("Somethings wrong! Try again later", "OK", {duration:3000})
      })
    }
  }

  rejectLeave(){
    if (this.leaveForm.valid){
      this.leaveService.saveLeave({
        id: this.receivedData.data.leave.id,
        organizationId:this.receivedData.data.leave.organizationId,
        name:this.receivedData.data.leave.name,
        leaveType:this.receivedData.data.leave.leaveType,
        reason:this.receivedData.data.leave.reason,
        leaveStartDate:this.receivedData.data.leave.leaveStartDate,
        leaveEndDate:this.receivedData.data.leave.leaveEndDate,
        approved: "rejected",
        approver: this.receivedData.data.user.name
      }).subscribe(data=>{
        this.closePopup()
        this.snackBar.open("Leave request Rejected!", "OK", {duration:3000})
      }, error => {
        this.snackBar.open("Somethings wrong! Try again later", "OK", {duration:3000})
      })
    }
  }
}
