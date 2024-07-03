import {Component, OnInit} from '@angular/core';
import {leaveDataStore} from "../../../shared/data-stores/leave-data-store";
import {MatDialog} from "@angular/material/dialog";
import {
  RequestTransferDialogComponent
} from "../../../shared/dialogs/request-transfer-dialog/request-transfer-dialog.component";
import {EmployeesService} from "../../../services/employees.service";
import {Observable, tap} from "rxjs";
import {AuthService} from "../../../services/auth.service";
import {RequestLeaveComponent} from "../../../shared/dialogs/request-leave/request-leave.component";
import {FormControl, FormGroup} from "@angular/forms";
import {LeaveService} from "../../../services/leave.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss']
})
export class LeaveRequestComponent implements OnInit{

  userId: any
  employeeDataStore: any
  employee: any = {
    id:''
  }

  filterForm = new FormGroup({
    filter: new FormControl(null)
  })
  leaveTypes:any = ["ALL", "ANNUAL", "SICK", "MATERNITY", "PATERNITY", "UNPAID"]

  leaveStore:any = leaveDataStore;
  leaveDataStore:any[]=[]
  filteredLeaves:any[]=[]

  constructor(private dialog: MatDialog, private employeesService: EmployeesService, private cookieService: AuthService, private leaveService: LeaveService, private snackBar: MatSnackBar) {
  }
  async ngOnInit() {
    await this.loadAllUsers().subscribe(()=>{
      this.getUser();
    })

    await this.loadAllLeaves().subscribe(()=>{})
  }

  loadAllUsers(): Observable<any>{
    return this.employeesService.getAllEmployees().pipe(
        tap(data => this.employeeDataStore = data)
    );
  }

  getUser() {
    this.userId = this.cookieService.userID().toString();
    return this.employee = this.employeeDataStore.find((emp: any) => emp.id === this.userId);
  }

  requestLeave(){
    const data = {
      userId: this.employee.id,
      employee: this.employee,
      organizationId: this.employee.organizationId
    }

    this.toggleDialog('', '', data, RequestLeaveComponent)
  }

  editLeave(leave:any){
    const data = {
      leaveId: leave.id,
      leave: leave,
      userId: this.employee.id,
      employee: this.employee,
      organizationId: this.employee.organizationId
    }

    this.toggleDialog('', '', data, RequestLeaveComponent)
  }

  loadAllLeaves(): Observable<any>{
    return this.leaveService.getAllLeaves().pipe(
        tap(data => this.leaveDataStore = data)
    );
  }

  filterLeaves(): any[]{
    if (!this.filterForm.value.filter || this.filterForm.value.filter == "ALL")
      this.filteredLeaves = this.leaveDataStore.filter((data: any) => data.organizationId === this.employee.organizationId && data.empId === this.employee.id)

    this.filteredLeaves.sort((a:any, b:any) => {
      return new Date(b.leaveStartDate).getTime() - new Date(a.leaveStartDate).getTime()
    })

    return this.filteredLeaves;
  }

  toggleDialog(title: any, msg: any, data: any, component: any) {
    const _popup = this.dialog.open(component, {
      maxHeight: '80vh',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        data: data,
        title: title,
        msg: msg
      }
    });
    _popup.afterClosed().subscribe(item => {
      this.loadAllLeaves().subscribe(()=>{
        this.filterLeaves()
      })
    })
  }

  selectFilter(val:any):any[] {
    if (val){
      this.filteredLeaves = this.leaveDataStore.filter((data: any) => data.organizationId === this.employee.organizationId && data.name === this.employee.name && data.leaveType == val)
    }
    else {
      this.filteredLeaves = this.leaveDataStore.filter((data: any) => data.organizationId === this.employee.organizationId && data.name === this.employee.name)
    }

    this.filteredLeaves.sort((a:any, b:any) => {
      return new Date(b.leaveStartDate).getTime() - new Date(a.leaveStartDate).getTime()
    })

    return this.filteredLeaves;
  }

  message(msg: string) {
    this.snackBar.open(msg, "OK", {duration:3000})
  }
}
