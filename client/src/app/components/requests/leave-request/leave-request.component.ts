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
    startDate: new FormControl(null),
    endDate: new FormControl(null),
    filter: new FormControl(null)
  })

  leaveStore:any = leaveDataStore;

  constructor(private dialog: MatDialog, private employeesService: EmployeesService, private cookieService: AuthService) {
  }
  ngOnInit() {
    this.loadAllUsers().subscribe(()=>{
      this.getUser();
    })
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
      organizationId: this.employee.organizationId
    }

    this.toggleDialog('', '', data, RequestLeaveComponent)
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
