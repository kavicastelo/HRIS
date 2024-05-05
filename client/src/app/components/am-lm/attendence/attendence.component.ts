import { Component } from '@angular/core';
import {attendanceDataStore} from "../../../shared/data-stores/attendance-data-store";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.scss']
})
export class AttendenceComponent {

  attendanceStore:any = attendanceDataStore
  isMarkingSheet:boolean = false;

  filterForm = new FormGroup({
    startDate: new FormControl(null),
    endDate: new FormControl(null),
    filter: new FormControl(null)
  })

  constructor(private router: Router, private route: ActivatedRoute) {
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
}
