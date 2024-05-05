import { Component } from '@angular/core';
import {attendanceDataStore} from "../../../data-stores/attendance-data-store";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-profile-attendance',
  templateUrl: './profile-attendance.component.html',
  styleUrls: ['./profile-attendance.component.scss']
})
export class ProfileAttendanceComponent {

  attendanceStore:any = attendanceDataStore

  filterForm = new FormGroup({
    startDate: new FormControl(null),
    endDate: new FormControl(null),
    filter: new FormControl(null)
  })

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

}
