import {Component, OnInit} from '@angular/core';
import {EmployeesService} from "../../../services/employees.service";
import {AuthService} from "../../../services/auth.service";
import {Observable, tap} from "rxjs";
import {AttendanceService} from "../../../services/attendance.service";
import {MatSnackBar} from "@angular/material/snack-bar";

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

  constructor(private employeeService: EmployeesService, private cookieService: AuthService, private attendanceService: AttendanceService, private snackBar: MatSnackBar) {
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

  markIn(e: any){
    const attendances = this.filterAttendance();
    attendances.forEach((attendance:any) => {
      if (attendance.email == e.email){
        this.attendanceService.saveAttendance({
          id: attendance.id,
          organizationId: this.organizationId,
          name: e.name,
          email: e.email,
          recordInTime: new Date()
        }).subscribe(data => {
          this.snackBar.open("Departure Marked", "OK")
        }, error => {
          console.log(error)
        })
      } else {
        this.attendanceService.saveAttendance({
          organizationId: this.organizationId,
          name: e.name,
          email: e.email,
          recordInTime: new Date()
        }).subscribe(data => {
          this.snackBar.open("Departure Marked", "OK")
        }, error => {
          console.log(error)
        })
      }
    })
  }

  depart(e: any){
    const attendances = this.filterAttendance();
    attendances.forEach((attendance:any) => {
      if (attendance.email == e.email){
        this.attendanceService.saveAttendance({
          id: attendance.id,
          organizationId: this.organizationId,
          name: e.name,
          email: e.email,
          recordInTime: attendance.recordInTime,
          recordOutTime: new Date()
        }).subscribe(data => {
          this.snackBar.open("Departure Marked", "OK")
        }, error => {
          console.log(error)
        })
      }
    })
  }

}
