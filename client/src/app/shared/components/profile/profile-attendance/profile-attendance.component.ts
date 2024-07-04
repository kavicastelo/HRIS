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

  constructor(private router: Router, private route: ActivatedRoute, private attendanceService: AttendanceService, private employeeService: EmployeesService, private cookieService: AuthService, private  dialog: MatDialog) {
  }
  async ngOnInit(): Promise<any> {
    this.organizationId = this.cookieService.organization()

    await this.loadAllUsers().subscribe(()=>{
      this.getUser()
    })
    await this.loadAllAttendance().subscribe(()=>{})
  }

  calculateHours(timestamp1: string, timestamp2: string, deductingHours: string): number {
    // Convert timestamps to Date objects
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    const deductingHour = parseInt(deductingHours);

    // Calculate the difference in milliseconds
    const differenceMs = date2.getTime() - date1.getTime();

    // Convert milliseconds to hours
    const hours = (differenceMs / (1000 * 60 * 60)) - deductingHour;

    return hours > 0 ? hours : 0;
  }

  workShiftDuration(shiftStartTime: string, shiftEndTime: string, deductingHours: any): number {

    const shiftStart = new Date();
    const shiftEnd = new Date();
    const deductingHour = parseInt(deductingHours);

    const [startHour, startPeriod] = shiftStartTime.split(' ');
    const shiftStartHour = parseInt(startHour.split('.')[0]);
    const shiftStartMinute = parseInt(startHour.split('.')[1]) || 0;

    const [endHour, endPeriod] = shiftEndTime.split(' ');
    const shiftEndHour = parseInt(endHour.split('.')[0]);
    const shiftEndMinute = parseInt(endHour.split('.')[1]) || 0;


    if (startPeriod === 'AM' && shiftStartHour === 12) {
      shiftStart.setHours(0, shiftStartMinute, 0, 0); // handle 12 AM case
    } else if (startPeriod === 'PM' && shiftStartHour !== 12) {
      shiftStart.setHours(shiftStartHour + 12, shiftStartMinute, 0, 0); // PM case, not 12 PM
    } else {
      shiftStart.setHours(shiftStartHour, shiftStartMinute, 0, 0); // AM case or 12 PM case
    }

    if (endPeriod === 'AM' && shiftEndHour === 12) {
      shiftEnd.setHours(0, shiftEndMinute, 0, 0); // handle 12 AM case
    } else if (endPeriod === 'PM' && shiftEndHour !== 12) {
      shiftEnd.setHours(shiftEndHour + 12, shiftEndMinute, 0, 0); // PM case, not 12 PM
    } else {
      shiftEnd.setHours(shiftEndHour, shiftEndMinute, 0, 0); // AM case or 12 PM case
    }

    const differenceMs = shiftEnd.getTime() - shiftStart.getTime();
    return differenceMs / (1000 * 60 * 60) - deductingHour;
  }

  loadAllAttendance(): Observable<any> {
    return this.attendanceService.getAllAttendance().pipe(
        tap(data => this.attendanceDataStore = data)
    );
  }

  filterAttendance(): any[]{
    this.filteredAttendance = this.attendanceDataStore.filter((data: any) => data.organizationId === this.organizationId && data.email === this.employee?.email)

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
