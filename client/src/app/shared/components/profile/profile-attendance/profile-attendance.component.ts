import { Component } from '@angular/core';
import {attendanceDataStore} from "../../../data-stores/attendance-data-store";
import {FormControl, FormGroup} from "@angular/forms";
import {Observable, tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AttendanceService} from "../../../../services/attendance.service";
import {AuthService} from "../../../../services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {EmployeesService} from "../../../../services/employees.service";

@Component({
  selector: 'app-profile-attendance',
  templateUrl: './profile-attendance.component.html',
  styleUrls: ['./profile-attendance.component.scss']
})
export class ProfileAttendanceComponent {

  organizationId:any;
  userId:any;
  attendanceStore:any = attendanceDataStore
  attendanceDataStore:any[] = [];
  filteredAttendance:any[] = [];

  employeeDataStore:any[] = [];
  employee:any;

  targetInput:any;

  constructor(private router: Router, private route: ActivatedRoute, private attendanceService: AttendanceService, private employeeService: EmployeesService, private cookieService: AuthService, private  dialog: MatDialog) {
  }
  async ngOnInit(): Promise<any> {
    this.organizationId = this.cookieService.organization()

    await this.loadAllUsers().subscribe(()=>{
      this.getUser()
    })
    await this.loadAllAttendance().subscribe(()=>{})
  }

  calculateHours(timestamp1: string, timestamp2: string): number {
    // Convert timestamps to Date objects
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);

    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(date2.getTime() - date1.getTime());

    // Convert milliseconds to hours
    const hours = differenceMs / (1000 * 60 * 60);

    return hours;
  }

  loadAllAttendance(): Observable<any> {
    return this.attendanceService.getAllAttendance().pipe(
        tap(data => this.attendanceDataStore = data)
    );
  }

  filterAttendance(): any[]{
    if (this.targetInput === undefined){
      this.filteredAttendance = this.attendanceDataStore.filter((data: any) => data.organizationId === this.organizationId && data.email == this.employee.email)
    }

    return this.filteredAttendance;
  }

  loadAllUsers(): Observable<any> {
    return this.employeeService.getAllEmployees().pipe(
        tap(data => this.employeeDataStore = data)
    );
  }

  getUser() {
    this.userId = this.cookieService.userID().toString();
    return this.employee = this.employeeDataStore.find((emp: any) => emp.id === this.userId);
  }

}
