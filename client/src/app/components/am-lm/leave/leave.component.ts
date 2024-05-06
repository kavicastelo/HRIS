import {Component, OnInit} from '@angular/core';
import {leaveDataStore} from "../../../shared/data-stores/leave-data-store";
import {FormControl, FormGroup} from "@angular/forms";
import {LeaveService} from "../../../services/leave.service";
import {Observable, tap} from "rxjs";
import {EmployeesService} from "../../../services/employees.service";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})
export class LeaveComponent implements OnInit{

  userId: any
  employeeDataStore: any[] = []
  employee: any = {
    id:''
  }

  leaveStore:any = leaveDataStore;
  leaveDataStore:any[] = [];
  filteredLeaves:any[] = [];

  leaveTypes:any = ["ALL", "ANNUAL", "SICK", "MATERNITY", "PATERNITY", "UNPAID"]

  filterForm = new FormGroup({
    startDate: new FormControl(null),
    endDate: new FormControl(null),
    filter: new FormControl(null)
  })

  constructor(private leaveService: LeaveService, private employeesService: EmployeesService, private cookieService: AuthService) {
  }
  ngOnInit(): void {
    this.loadAllUsers().subscribe(()=>{
      this.getUser();
    })
    this.loadAllLeaves().subscribe(()=>{})
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

  loadAllLeaves(): Observable<any>{
    return this.leaveService.getAllLeaves().pipe(
        tap(data => this.leaveDataStore = data)
    );
  }

  filterLeaves(): any[]{
    if (!this.filterForm.value.filter || this.filterForm.value.filter == "ALL")
      this.filteredLeaves = this.leaveDataStore.filter((data: any) => data.organizationId === this.employee.organizationId)

    this.filteredLeaves.sort((a:any, b:any) => {
      return new Date(b.leaveStartDate).getTime() - new Date(a.leaveStartDate).getTime()
    })

    return this.filteredLeaves;
  }

  selectFilter(val:any):any[] {
    if (val){
      this.filteredLeaves = this.leaveDataStore.filter((data: any) => data.organizationId === this.employee.organizationId && data.leaveType == val)
    }
    else {
      this.filteredLeaves = this.leaveDataStore.filter((data: any) => data.organizationId === this.employee.organizationId)
    }

    this.filteredLeaves.sort((a:any, b:any) => {
      return new Date(b.leaveStartDate).getTime() - new Date(a.leaveStartDate).getTime()
    })

    return this.filteredLeaves;
  }
}
