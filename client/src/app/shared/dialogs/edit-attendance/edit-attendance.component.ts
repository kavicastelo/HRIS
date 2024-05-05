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
            department: ['', Validators.required],
            start: ['', Validators.required],
            end: ['', Validators.required]
        });
    }

    patchValue() {
        if (this.receivedData.data) {
            const startTime = `${new Date(this.receivedData.data.attendance.recordInTime).getHours()}:${(new Date(this.receivedData.data.attendance.recordInTime).getMinutes() < 10 ? '0' : '') + new Date(this.receivedData.data.attendance.recordInTime).getMinutes()}`;
            const endTime = `${new Date(this.receivedData.data.attendance.recordOutTime).getHours()}:${(new Date(this.receivedData.data.attendance.recordOutTime).getMinutes() < 10 ? '0' : '') + new Date(this.receivedData.data.attendance.recordOutTime).getMinutes()}`;
            this.attendanceForm.get('date').setValue(new Date(this.receivedData.data.attendance.recordInTime))
            this.attendanceForm.get('name').setValue(this.receivedData.data.attendance.name)
            this.attendanceForm.get('department').setValue(this.receivedData.data.department)
            this.attendanceForm.get('start').setValue(startTime)
            this.attendanceForm.get('end').setValue(endTime)
            this.startTime = new Date(this.receivedData.data.attendance.recordInTime)
            this.endTime = new Date(this.receivedData.data.attendance.recordOutTime)
        }
        console.log(this.attendanceForm.value)
    }

    closePopup() {
        this.dialog.closeAll()
    }

    editAttendance() {
        if (this.attendanceForm.valid) {
            console.log(this.attendanceForm.value)

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
            }).subscribe(data=>{
              this.closePopup()
              this.snackBar.open("Attendance data updated","OK", {duration:3000})
            }, error => {
              console.log(error)
            })
        }
    }
}
