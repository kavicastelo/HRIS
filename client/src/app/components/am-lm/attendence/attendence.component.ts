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
