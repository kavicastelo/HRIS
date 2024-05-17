import {Component, OnInit} from '@angular/core';
import {EmployeesService} from "../../../services/employees.service";
import {AuthService} from "../../../services/auth.service";
import {Observable, tap} from "rxjs";
import {AttendanceService} from "../../../services/attendance.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationsService} from "../../../services/notifications.service";
import {TimeFormatPipe} from "../../../DTO/TimeFormatPipe";
import {DateFormatPipe} from "../../../DTO/DateFormatPipe";

@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.component.html',
  styleUrls: ['./mark-attendance.component.scss']
})
export class MarkAttendanceComponent implements OnInit{

  userId: any;
  organizationId:any;
  employeeDataStore: any[] = [];
  attendanceDataStore: any[] = [];
  filteredEmployees: any[] = [];
  filteredAttendance: any[] = [];
  employee: any = {
    id:''
  }

  targetInput:any;

  constructor(private employeeService: EmployeesService,
              private cookieService: AuthService,
              private notificationsService: NotificationsService,
              private attendanceService: AttendanceService,
              private snackBar: MatSnackBar) {
  }

  async ngOnInit(): Promise<any> {
    this.organizationId = this.cookieService.organization()
    this.userId = this.cookieService.userID()
    await this.loadAllUsers().subscribe(()=>{
      this.getUser()
    })

    await this.loadAllAttendance().subscribe(()=>{
      this.filterAttendance()
    })
  }

  loadAllUsers(): Observable<any> {
    return this.employeeService.getAllEmployees().pipe(
        tap(data => this.employeeDataStore = data)
    );
  }

  loadAllAttendance(): Observable<any> {
    return this.attendanceService.getAllAttendance().pipe(
        tap(data => this.attendanceDataStore = data)
    );
  }

  getUser() {
    this.userId = this.cookieService.userID().toString();
    return this.employee = this.employeeDataStore.find((emp: any) => emp.id === this.userId);
  }

  filterEmployees(): any[]{
    if (this.targetInput === undefined){
      this.filteredEmployees = this.employeeDataStore.filter((data: any) => data.organizationId === this.employee.organizationId)
    }
    this.filteredEmployees.sort((a:any, b:any) => {
      return new Date(b.jobData.doj).getTime() - new Date(a.jobData.doj).getTime()
    })

    return this.filteredEmployees;
  }

  filterAttendance(): any[]{
    this.filteredAttendance = this.attendanceDataStore.filter((data: any) => data.organizationId === this.organizationId)

    return this.filteredAttendance;
  }

  handleSearch(data: any): void {
    this.targetInput = data as HTMLInputElement;
    const value = this.targetInput.value
    if (value) {
      this.filteredEmployees = this.employeeDataStore.filter((data: any) =>
          data.organizationId === this.employee.organizationId && data.name.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.filteredEmployees = this.employeeDataStore.filter((data: any) => data.organizationId === this.employee.organizationId);
    }
  }

  async markIn(e: any) {
    const attendances = this.filterAttendance();

    // Filter out duplicate attendance entries for the current employee
    const uniqueAttendances = attendances.filter((attendance: any) =>
        attendance.recordInTime != null && attendance.recordOutTime == null && attendance.email == e.email
    );

    try {
      if (uniqueAttendances.length > 0) {
        // Mark existing attendance entry
        await this.attendanceService.saveAttendance({
          id: uniqueAttendances[0].id, // Assuming there's only one unique attendance entry per employee
          organizationId: this.organizationId,
          name: e.name,
          email: e.email,
          recordInTime: new Date()
        }).toPromise();
      } else {
        // Mark new attendance entry
        await this.attendanceService.saveAttendance({
          organizationId: this.organizationId,
          name: e.name,
          email: e.email,
          recordInTime: new Date()
        }).toPromise();
      }

      const notificationData = {
        userId: e.id,
        notification: this.employee.name + ` marked you are attended to the work at ${new TimeFormatPipe().transform(new Date().toString())} in ${new DateFormatPipe().transform(new Date().toString())}`,
        timestamp: new Date(),
        router: '/profile/'+this.userId+'/attendance/'+this.userId,
        status: true
      }

      this.pushNotification(notificationData);

      this.snackBar.open("Attendance Marked", "OK", {duration:3000});
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  }

  async depart(e: any){
    const attendances = this.filterAttendance();

    // Filter out duplicate attendance entries for the current employee
    const uniqueAttendances = attendances.filter((attendance: any) =>
        attendance.recordInTime != null && attendance.recordOutTime == null && attendance.email == e.email
    );

    try {
      if (uniqueAttendances.length > 0) {
        // calculate late minutes
        let lateMinutes:any = 0;
        if (this.calculateLateMins(uniqueAttendances[0].recordInTime) < (9 * 60)) {
          lateMinutes = (9*60) - this.calculateLateMins(uniqueAttendances[0].recordInTime)
        }
        // Mark existing attendance entry
        await this.attendanceService.departAttendance(uniqueAttendances[0].id,{
          organizationId: this.organizationId,
          name: e.name,
          email: e.email,
          recordInTime: uniqueAttendances[0].recordInTime,
          recordOutTime: new Date(),
          lateMinutes: lateMinutes
        }).toPromise();
        this.snackBar.open("Departure Marked", "OK", {duration:3000});

        const notificationData = {
          userId: e.id,
          notification: this.employee.name + ` marked you are departure from the work at ${new TimeFormatPipe().transform(new Date().toString())} in ${new DateFormatPipe().transform(new Date().toString())}`,
          timestamp: new Date(),
          router: '/profile/'+this.userId+'/attendance/'+this.userId,
          status: true
        }

        this.pushNotification(notificationData);

      } else {
        // Mark new attendance entry
        this.snackBar.open("User not attended to mark the departure", "OK", {duration:3000});
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  }

  calculateLateMins(timestamp1: string): number {
    // Convert timestamps to Date objects
    const date1 = new Date(timestamp1);
    const date2 = new Date();

    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(date2.getTime() - date1.getTime());

    // Convert milliseconds to minutes
    return differenceMs / (1000 * 60);
  }

  pushNotification(data:any){
    if (data){
      this.notificationsService.saveNotification(data).subscribe(data=>{
      }, error => {
        console.log(error)
      })
    }
  }

}
