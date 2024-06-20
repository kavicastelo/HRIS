import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AttendanceService} from "../../../services/attendance.service";
import {Observable, tap} from "rxjs";
import {AuthService} from "../../../services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {EditAttendanceComponent} from "../../../shared/dialogs/edit-attendance/edit-attendance.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ShiftsService} from "../../../services/shifts.service";

@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.scss']
})
export class AttendenceComponent implements OnInit{

  organizationId:any;
  attendanceDataStore:any[] = [];
  shiftDataStore: any[] = [];
  filteredAttendance:any[] = [];
  filteredShifts: any[] = [];

  targetInput:any;

  constructor(private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar, private shiftService: ShiftsService, private attendanceService: AttendanceService, private cookieService: AuthService, private  dialog: MatDialog) {
  }
  async ngOnInit(): Promise<any> {
    this.organizationId = this.cookieService.organization()

    await this.loadAllAttendance().subscribe(()=>{})
    await this.loadAllShifts().subscribe(()=>{})
  }

  loadAllAttendance(): Observable<any> {
    return this.attendanceService.getAllAttendance().pipe(
        tap(data => this.attendanceDataStore = data)
    );
  }

  filterAttendance(): any[]{
    if (this.targetInput === undefined){
      this.filteredAttendance = this.attendanceDataStore.filter((data: any) => data.organizationId === this.organizationId)
    }

    return this.filteredAttendance;
  }

  handleSearch(data: any): void {
    this.targetInput = data as HTMLInputElement;
    const value = this.targetInput.value
    if (value) {
      this.filteredAttendance = this.attendanceDataStore.filter((data: any) => data.name.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.filteredAttendance = this.attendanceDataStore.filter((data: any) => data.organizationId === this.organizationId)
    }
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

  editAttendance(attendance: any) {
    const data = {
      attendance: attendance,
      department: 'HR department'
    }
    this.toggleDialog('','',data, EditAttendanceComponent)
  }

  toggleDialog(title: any, msg: any, data: any, component: any) {
    const _popup = this.dialog.open(component, {
      width: '350px',
      maxHeight: '100%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        data: data,
        title: title,
        msg: msg
      }
    });
    _popup.afterClosed().subscribe(item => {
      this.loadAllAttendance().subscribe(()=>{
        this.filterAttendance()
      })
    })
  }

  loadAllShifts(): Observable<any>{
    return this.shiftService.getAllShifts().pipe(
        tap(data => this.shiftDataStore = data)
    );
  }

  filterShifts(): any[]{
    this.filteredShifts = this.shiftDataStore.filter((data: any) => data.organizationId === this.organizationId)

    return this.filteredShifts;
  }

  assignShift(id: any, shift: any) {
    if (id){
      this.attendanceService.assignShift(id, shift).subscribe(data => {
        this.openSnackBar("Shift Assigned", "OK")
      }, error => {
        this.openSnackBar("Somethings Wrong! Try again!", "OK")
      })
    }
    else {
      this.openSnackBar("Employee not attended today", "OK")
    }
  }

  openSnackBar(message: any, action: any){
    this.snackBar.open(message, action, {duration:3000})
  }
}
