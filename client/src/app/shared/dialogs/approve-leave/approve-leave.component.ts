import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MultimediaService} from "../../../services/multimedia.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {LeaveService} from "../../../services/leave.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EmployeesService} from "../../../services/employees.service";
import {tap} from "rxjs";

@Component({
  selector: 'app-approve-leave',
  templateUrl: './approve-leave.component.html',
  styleUrls: ['./approve-leave.component.scss']
})
export class ApproveLeaveComponent {

  receivedData:any;

  requestedEmployee:any;

  leaveForm = new FormGroup({
    name: new FormControl(null),
    leaveType: new FormControl(null),
    reason: new FormControl(null),
    startDate: new FormControl(new Date()),
    endDate: new FormControl(new Date()),
    dateCount: new FormControl(1, {validators: [Validators.required, Validators.min(1)]})
  })

  constructor(private multimediaService: MultimediaService,
              private dialog: MatDialog,
              private leaveService: LeaveService,
              private employeesService: EmployeesService,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<ApproveLeaveComponent>) {
  }

  async ngOnInit(): Promise<any> {
    this.receivedData = this.data;
    this.patchValues()

    await this.loadRequestedEmployee().subscribe()
  }

  loadRequestedEmployee(){
    return this.employeesService.getEmployeeById(this.receivedData.data.leave.empId).pipe(
      tap(data => this.requestedEmployee = data)
    )
  }

  patchValues(){
    if (this.receivedData.data){
      this.leaveForm.get('name')?.setValue(this.receivedData.data.user.name)
      this.leaveForm.get('leaveType')?.setValue(this.receivedData.data.leave.leaveType)
      this.leaveForm.get('reason')?.setValue(this.receivedData.data.leave.reason)
      this.leaveForm.get('startDate')?.setValue(new Date(this.receivedData.data.leave.leaveStartDate))
      this.leaveForm.get('endDate')?.setValue(new Date(this.receivedData.data.leave.leaveEndDate))
      this.leaveForm.get('dateCount')?.setValue(this.getDateCountBetween(new Date(this.receivedData.data.leave.leaveStartDate), new Date(this.receivedData.data.leave.leaveEndDate)))
    }
  }

  closePopup(){
    this.dialog.closeAll()
  }

  approveLeave() {
    const formDateCount = this.leaveForm.get('dateCount')?.value
    if (formDateCount == null) {
      this.snackBar.open("Date count cannot be null", "OK", {duration:3000})
      return;
    } else {
      if (formDateCount < 1) {
        this.snackBar.open("Date count cannot be less than 1", "OK", {duration:3000})
        return
      }
    }

    switch (this.receivedData.data.leave.leaveType) {
      case "ANNUAL":
        if (this.requestedEmployee.annualLeaveBalance < formDateCount) {
          this.snackBar.open("Not enough leaves", "OK", {duration:3000})
          return
        }
        break;
      case "SICK":
        if (this.requestedEmployee.sickLeaveBalance < formDateCount) {
          this.snackBar.open("Not enough leaves", "OK", {duration:3000})
          return
        }
        break;
      case "CASUAL":
        if (this.requestedEmployee.casualLeaveBalance < formDateCount) {
          this.snackBar.open("Not enough leaves", "OK", {duration:3000})
          return
        }
        break;
      case "MATERNITY":
        if (this.requestedEmployee.maternityLeaveBalance < formDateCount) {
          this.snackBar.open("Not enough leaves", "OK", {duration:3000})
          return
        }
        break;
      case "PATERNITY":
        if (this.requestedEmployee.paternityLeaveBalance < formDateCount) {
          this.snackBar.open("Not enough leaves", "OK", {duration:3000})
          return
        }
        break;
      case "UNPAID":
        if (this.requestedEmployee.unpaidLeaveBalance < formDateCount) {
          this.snackBar.open("Not enough leaves", "OK", {duration:3000})
          return
        }
        break;
    }

    if (this.leaveForm.valid){
      this.leaveService.saveLeave({
        id: this.receivedData.data.leave.id,
        organizationId:this.receivedData.data.leave.organizationId,
        name:this.receivedData.data.leave.name,
        empId:this.receivedData.data.leave.empId,
        leaveType:this.receivedData.data.leave.leaveType,
        reason:this.receivedData.data.leave.reason,
        leaveStartDate:this.receivedData.data.leave.leaveStartDate,
        leaveEndDate:this.receivedData.data.leave.leaveEndDate,
        approved: "approved",
        approver: this.receivedData.data.user.name
      }).subscribe(data=>{
        this.updateEmployee(formDateCount)
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
        empId:this.receivedData.data.leave.empId,
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

  updateEmployee(dateCount: any) {
    switch (this.receivedData.data.leave.leaveType) {
      case "ANNUAL":
        this.requestedEmployee.annualLeaveBalance = this.requestedEmployee.annualLeaveBalance - dateCount
        break;
      case "SICK":
        this.requestedEmployee.sickLeaveBalance = this.requestedEmployee.sickLeaveBalance - dateCount
        break;
      case "CASUAL":
        this.requestedEmployee.casualLeaveBalance = this.requestedEmployee.casualLeaveBalance - dateCount
        break;
      case "MATERNITY":
        this.requestedEmployee.maternityLeaveBalance = this.requestedEmployee.maternityLeaveBalance - dateCount
        break;
      case "PATERNITY":
        this.requestedEmployee.paternityLeaveBalance = this.requestedEmployee.paternityLeaveBalance - dateCount
        break;
      case "UNPAID":
        this.requestedEmployee.noPayLeaveBalance = this.requestedEmployee.noPayLeaveBalance - dateCount
        break;
    }

    this.employeesService.updateEmployeeLeaves(this.requestedEmployee.id, {
      annualLeaveBalance: this.requestedEmployee.annualLeaveBalance,
      sickLeaveBalance: this.requestedEmployee.sickLeaveBalance,
      casualLeaveBalance: this.requestedEmployee.casualLeaveBalance,
      maternityLeaveBalance: this.requestedEmployee.maternityLeaveBalance,
      paternityLeaveBalance: this.requestedEmployee.paternityLeaveBalance,
      noPayLeaveBalance: this.requestedEmployee.noPayLeaveBalance
    }).subscribe(data => {
      this.closePopup()
    })
  }

  getDateCountBetween(startDate: any, endDate: any) {
    if (startDate == null || endDate == null) {
      return 0
    }
    startDate = new Date(startDate)
    endDate = new Date(endDate)
    return Math.round((Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) - Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())) / (1000 * 60 * 60 * 24));
  }
}
