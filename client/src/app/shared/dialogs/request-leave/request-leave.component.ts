import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MultimediaService} from "../../../services/multimedia.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LeaveService} from "../../../services/leave.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EventService} from "../../../services/event.service";
import {Observable, Subscription, tap} from "rxjs";

@Component({
  selector: 'app-request-leave',
  templateUrl: './request-leave.component.html',
  styleUrls: ['./request-leave.component.scss']
})
export class RequestLeaveComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  receivedData:any;
  selectedLeave:any;
  leaveTypes:any = ["ANNUAL", "SICK", "CASUAL", "MATERNITY", "PATERNITY", "UNPAID"]

  leaveForm: FormGroup | any;

  requestedEmployee:any
  holidaysStore:any[] = [];
  filteredHolidays:any[] = [];
  disabledDates: any[] = [];

  constructor(private multimediaService: MultimediaService,
              private dialog: MatDialog,
              private leaveService: LeaveService,
              private eventService: EventService,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<RequestLeaveComponent>) {
  }

  async ngOnInit(): Promise<void> {
    this.receivedData = this.data;

    this.initializeForm();

    this.subscriptions.add(await this.loadAllHolidays().subscribe(() => {
      this.filterHolidays();
      this.addDisabledDates();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initializeForm() {
    this.leaveForm = new FormGroup({
      leaveType: new FormControl(null, [Validators.required]),
      reason: new FormControl(null, [Validators.required]),
      startDate: new FormControl(null, [Validators.required, this.dateFilter.bind(this)]),
      endDate: new FormControl(null, [Validators.required, this.dateFilter.bind(this)])
    });

    // Re-validate the form controls after the disabled dates are set
    this.leaveForm.controls['startDate'].updateValueAndValidity();
    this.leaveForm.controls['endDate'].updateValueAndValidity();
  }

  // Validator
  dateFilter(control: FormControl): { [key: string]: boolean } | null {
    const date = control.value;
    if (date) {
      const time = new Date(date).getTime();
      if (this.disabledDates.includes(time)) {
        return { 'invalidDate': true };
      }
    }
    return null;
  }

  loadAllHolidays(): Observable<any> {
    return this.eventService.getHolidays().pipe(
      tap(data => this.holidaysStore = data)
    );
  }

  filterHolidays(): void {
    this.filteredHolidays = this.holidaysStore.filter((data: any) => data.meta.organizationId == this.receivedData.data.organizationId);
  }

  addDisabledDates(): void {
    this.disabledDates = this.filteredHolidays.map((h: any) => new Date(h.start).getTime());
  }

  closePopup(){
    this.dialog.closeAll()
  }

  patchValue(){
    this.leaveForm.get('leaveType')?.setValue(this.receivedData.data.leave.leaveType)
    this.leaveForm.get('reason')?.setValue(this.receivedData.data.leave.reason)
    this.leaveForm.get('startDate')?.setValue(this.receivedData.data.leave.leaveStartDate)
    this.leaveForm.get('endDate')?.setValue(this.receivedData.data.leave.leaveEndDate)
  }

  submitLeave() {
    const dateCount =this.getDateCountBetween(this.leaveForm.value.startDate, this.leaveForm.value.endDate)

    if (dateCount < 0){
      this.snackBar.open("Invalid dates", "OK", {duration:3000})
      return
    }

    switch (this.selectedLeave) {
      case "ANNUAL":
        if (this.receivedData.data.employee.annualLeaveBalance < dateCount){
          this.snackBar.open("Not enough leaves", "OK", {duration:3000})
          return
        }
        break;

      case "SICK":
        if (this.receivedData.data.employee.sickLeaveBalance < dateCount){
          this.snackBar.open("Not enough leaves", "OK", {duration:3000})
          return
        }
        break;

      case "CASUAL":
        if (this.receivedData.data.employee.casualLeaveBalance < dateCount){
          this.snackBar.open("Not enough leaves", "OK", {duration:3000})
          return
        }
        break;

      case "MATERNITY":
        if (this.receivedData.data.employee.maternityLeaveBalance < dateCount){
          this.snackBar.open("Not enough leaves", "OK", {duration:3000})
          return
        }
        break;

      case "PATERNITY":
        if (this.receivedData.data.employee.paternityLeaveBalance < dateCount){
          this.snackBar.open("Not enough leaves", "OK", {duration:3000})
          return
        }
        break;

      case "UNPAID":
        if (this.receivedData.data.employee.noPayLeaveBalance < dateCount){
          this.snackBar.open("Not enough leaves", "OK", {duration:3000})
          return
        }
        break;

      default:
        break;
    }


    if (this.leaveForm.valid){
      this.leaveService.saveLeave({
        organizationId:this.receivedData.data.organizationId,
        empId:this.receivedData.data.employee.id,
        name:this.receivedData.data.employee.name,
        leaveType:this.leaveForm.value.leaveType,
        reason:this.leaveForm.value.reason,
        leaveStartDate:this.leaveForm.value.startDate,
        leaveEndDate:this.leaveForm.value.endDate,
        approved: "pending"
      }).subscribe(data=>{
        this.closePopup()
        this.snackBar.open("Leave requested Successfully!", "OK", {duration:3000})
      }, error => {
        this.snackBar.open("Somethings wrong! Try again later", "OK", {duration:3000})
      })
    }
  }

  editLeave() {
    if (this.leaveForm.valid){
      this.leaveService.saveLeave({
        id: this.receivedData.data.leave.id,
        organizationId:this.receivedData.data.organizationId,
        empId:this.receivedData.data.employee.id,
        name:this.receivedData.data.employee.name,
        leaveType:this.leaveForm.value.leaveType,
        reason:this.leaveForm.value.reason,
        leaveStartDate:this.leaveForm.value.startDate,
        leaveEndDate:this.leaveForm.value.endDate,
        approved: "pending"
      }).subscribe(data=>{
        this.closePopup()
        this.snackBar.open("Leave requested Updated!", "OK", {duration:3000})
      }, error => {
        this.snackBar.open("Somethings wrong! Try again later", "OK", {duration:3000})
      })
    }
  }

  getDateCountBetween(startDate: any, endDate: any) {
    if (startDate == null || endDate == null) {
      return 0
    }
    return Math.round((Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) - Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())) / (1000 * 60 * 60 * 24));
  }
}
