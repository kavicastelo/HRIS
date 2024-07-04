import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MultimediaService} from "../../../services/multimedia.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ShiftsService} from "../../../services/shifts.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AttendanceService} from "../../../services/attendance.service";

@Component({
    selector: 'app-edit-attendance',
    templateUrl: './edit-attendance.component.html',
    styleUrls: ['./edit-attendance.component.scss']
})
export class EditAttendanceComponent {

    receivedData: any;

    startTime: any;
    endTime: any

    attendanceForm: FormGroup | any;

    constructor(private multimediaService: MultimediaService,
                private dialog: MatDialog,
                private formBuilder: FormBuilder,
                private attendanceService: AttendanceService,
                private snackBar: MatSnackBar,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private ref: MatDialogRef<EditAttendanceComponent>) {
    }

    async ngOnInit(): Promise<any> {
        this.receivedData = this.data;

        this.createForm();
        this.patchValue();
    }

    createForm() {
        this.attendanceForm = this.formBuilder.group({
            date: ['', Validators.required],
            name: ['', Validators.required],
            start: ['', Validators.required],
            end: ['', Validators.required]
        });
    }

    patchValue() {
        if (this.receivedData.data) {
            const startTime = `${(new Date(this.receivedData.data.attendance.recordInTime).getHours() < 10 ? '0' : '') + new Date(this.receivedData.data.attendance.recordInTime).getHours()}:${(new Date(this.receivedData.data.attendance.recordInTime).getMinutes() < 10 ? '0' : '') + new Date(this.receivedData.data.attendance.recordInTime).getMinutes()}`;
            const endTime = `${(new Date(this.receivedData.data.attendance.recordOutTime).getHours() < 10 ? '0' : '') + new Date(this.receivedData.data.attendance.recordOutTime).getHours()}:${(new Date(this.receivedData.data.attendance.recordOutTime).getMinutes() < 10 ? '0' : '') + new Date(this.receivedData.data.attendance.recordOutTime).getMinutes()}`;
            this.attendanceForm.get('date').setValue(new Date(this.receivedData.data.attendance.recordInTime))
            this.attendanceForm.get('name').setValue(this.receivedData.data.attendance.name)
            this.attendanceForm.get('start').setValue(startTime)
            this.attendanceForm.get('end').setValue(endTime)
            this.startTime = new Date(this.receivedData.data.attendance.recordInTime)
            this.endTime = new Date(this.receivedData.data.attendance.recordOutTime)
        }
    }

    closePopup() {
        this.dialog.closeAll()
    }

    editAttendance() {
        if (this.attendanceForm.valid) {

// Extract the date, start time, and end time from the form data
            const {date, start, end} = this.attendanceForm.value;

// Convert the start and end times to hours and minutes
            const [startHours, startMinutes] = start.split(":").map(Number);
            const [endHours, endMinutes] = end.split(":").map(Number);

// Set the date and time for the start timestamp
            const startTimeStamp = new Date(date);
            startTimeStamp.setHours(startHours);
            startTimeStamp.setMinutes(startMinutes);

// Set the date and time for the end timestamp
            const endTimeStamp = new Date(date);
            endTimeStamp.setHours(endHours);
            endTimeStamp.setMinutes(endMinutes);

            this.attendanceService.saveAttendance({
                id: this.receivedData.data.attendance.id,
                organizationId: this.receivedData.data.attendance.organizationId,
                name: this.receivedData.data.attendance.name,
                email: this.receivedData.data.attendance.email,
                recordInTime: startTimeStamp.toString(),
                recordOutTime: endTimeStamp.toString(),
                lateMinutes: this.calculateLateMins(startTimeStamp.toString(), this.receivedData.data.attendance.shiftStartTime),
                earlyDepartureMinutes: this.calculateEarlyDepartureMins(endTimeStamp.toString(), this.receivedData.data.attendance.shiftEndTime),
                overtimeHours: this.calculateOvertimeHours(endTimeStamp.toString(), this.receivedData.data.attendance.shiftEndTime),
                shiftStartTime: this.receivedData.data.attendance.shiftStartTime,
                shiftEndTime: this.receivedData.data.attendance.shiftEndTime,
                earliestInTime: this.receivedData.data.attendance.earliestInTime,
                latestOutTime: this.receivedData.data.attendance.latestOutTime,
                deductingHours: this.receivedData.data.attendance.deductingHours
            }).subscribe(data=>{
              this.closePopup()
              this.snackBar.open("Attendance data updated","OK", {duration:3000})
            }, error => {
              console.log(error)
            })
        }
    }

  calculateLateMins(recordInTime: string, shiftStartTime: any): number {
    const inTime = new Date(recordInTime);
    const shiftStart = new Date(inTime);

    const [startHour, startPeriod] = shiftStartTime.split(' ');
    const shiftStartHour = parseInt(startHour.split('.')[0]);
    const shiftStartMinute = parseInt(startHour.split('.')[1]) || 0;

    if (startPeriod === 'AM' && shiftStartHour === 12) {
      shiftStart.setHours(0, shiftStartMinute, 0, 0); // handle 12 AM case
    } else if (startPeriod === 'PM' && shiftStartHour !== 12) {
      shiftStart.setHours(shiftStartHour + 12, shiftStartMinute, 0, 0); // PM case, not 12 PM
    } else {
      shiftStart.setHours(shiftStartHour, shiftStartMinute, 0, 0); // AM case or 12 PM case
    }

    // Calculate the difference in milliseconds
    const differenceMs = inTime.getTime() - shiftStart.getTime();

    // Convert milliseconds to minutes
    return differenceMs > 0 ? differenceMs / (1000 * 60) : 0;
  }

  calculateEarlyDepartureMins(recordOutTime: string, shiftEndTime: any): number {
    const outTime = new Date(recordOutTime);
    const shiftEnd = new Date(outTime);

    const [endHour, endPeriod] = shiftEndTime.split(' ');
    const shiftEndHour = parseInt(endHour.split('.')[0]);
    const shiftEndMinute = parseInt(endHour.split('.')[1]) || 0;

    if (endPeriod === 'AM' && shiftEndHour === 12) {
      shiftEnd.setHours(0, shiftEndMinute, 0, 0); // handle 12 AM case
    } else if (endPeriod === 'PM' && shiftEndHour !== 12) {
      shiftEnd.setHours(shiftEndHour + 12, shiftEndMinute, 0, 0); // PM case, not 12 PM
    } else {
      shiftEnd.setHours(shiftEndHour, shiftEndMinute, 0, 0); // AM case or 12 PM case
    }

    // Calculate the difference in milliseconds
    const differenceMs = shiftEnd.getTime() - outTime.getTime();

    // Convert milliseconds to minutes, return 0 if no early departure
    return differenceMs > 0 ? differenceMs / (1000 * 60) : 0;
  }

  calculateOvertimeHours(recordOutTime: string, shiftEndTime: any): number {
    const outTime = new Date(recordOutTime);
    const shiftEnd = new Date(outTime);

    const [endHour, endPeriod] = shiftEndTime.split(' ');
    const shiftEndHour = parseInt(endHour.split('.')[0]);
    const shiftEndMinute = parseInt(endHour.split('.')[1]) || 0;

    if (endPeriod === 'AM' && shiftEndHour === 12) {
      shiftEnd.setHours(0, shiftEndMinute, 0, 0); // handle 12 AM case
    } else if (endPeriod === 'PM' && shiftEndHour !== 12) {
      shiftEnd.setHours(shiftEndHour + 12, shiftEndMinute, 0, 0); // PM case, not 12 PM
    } else {
      shiftEnd.setHours(shiftEndHour, shiftEndMinute, 0, 0); // AM case or 12 PM case
    }

    // Calculate the difference in milliseconds
    const differenceMs = outTime.getTime() - shiftEnd.getTime();

    // Convert milliseconds to hours, return 0 if no overtime
    return differenceMs > 0 ? differenceMs / (1000 * 60 * 60) : 0;
  }
}
