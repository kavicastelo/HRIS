import {Component, Inject} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {MultimediaService} from "../../../services/multimedia.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ShiftsService} from "../../../services/shifts.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-create-shift-dialog',
  templateUrl: './create-shift-dialog.component.html',
  styleUrls: ['./create-shift-dialog.component.scss']
})
export class CreateShiftDialogComponent {

  receivedData:any;

  onboardinTaskForm: FormGroup | any;

  constructor(private multimediaService: MultimediaService,
              private dialog: MatDialog,
              private formBuilder: FormBuilder,
              private shiftService: ShiftsService,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<CreateShiftDialogComponent>) {
  }

  async ngOnInit(): Promise<any> {
    this.receivedData = this.data;

    this.createForm();
  }

  createForm() {
    this.onboardinTaskForm = this.formBuilder.group({
      longName: ['', Validators.required],
      name: ['', Validators.required],
      start: ['', [Validators.required, this.timeValidator]],
      end: ['', [Validators.required, this.timeValidator]],
      duration: ['', Validators.required, this.isValidHour],
      earliestInTime: ['', Validators.required, this.isValidHour],
      latestOutTime: ['', Validators.required, this.isValidHour],
      firstHalfDuration: ['', Validators.required, this.isValidHour],
      secondHalfDuration: ['', Validators.required, this.isValidHour],
      shiftNature: ['', Validators.required],
      offShift: ['', Validators.required],
      deductingHours: ['', Validators.required, this.isValidHour],
      minPreOTHours: ['', Validators.required, this.isValidHour],
      minPostOTHours: ['', Validators.required, this.isValidHour],
      maxPreOTHours: ['', Validators.required, this.isValidHour],
      maxPostOTHours: ['', Validators.required, this.isValidHour],
      description: ['', Validators.required, this.isDescriptionLength]
    });
  }

  timeValidator(control:any) {
    const valid = /^(0?[1-9]|1[0-2])\.\d{2} (AM|PM)$/.test(control.value);
    return valid ? null : { invalidTime: true };
  }

  isValidHour(control: AbstractControl):
    Observable<ValidationErrors | null> {
    const v: number = control.value;
    if (v >= 0 && v <= 24 && v.toString().length <= 2) {
      return of(null);
    }
    return of({ inValidValue: true});
  }

  isDescriptionLength(control: AbstractControl):
    Observable<ValidationErrors | null> {
    const v: string = control.value;
    if (v.length <= 1000) {
      return of(null);
    }
    return of({ inValidValue: true});
  }

  updateStartTime(period: string) {
    const startControl = this.onboardinTaskForm.get('start');
    const currentValue = startControl.value;
    if (currentValue) {
      startControl.setValue(currentValue + ' ' + period);
    }
  }

  updateEndTime(period: string) {
    const endControl = this.onboardinTaskForm.get('end');
    const currentValue = endControl.value;
    if (currentValue) {
      endControl.setValue(currentValue + ' ' + period);
    }
  }

  closePopup(){
    this.dialog.closeAll()
  }

  saveShift() {
    if (this.onboardinTaskForm.valid){
      this.shiftService.saveShift({
        organizationId: this.receivedData.data.organizationId,
        longName: this.onboardinTaskForm.value.longName,
        name: this.onboardinTaskForm.value.name,
        startTime: this.onboardinTaskForm.value.start,
        endTime: this.onboardinTaskForm.value.end,
        duration: this.onboardinTaskForm.value.duration,
        earliestInTime: this.onboardinTaskForm.value.earliestInTime,
        latestOutTime: this.onboardinTaskForm.value.latestOutTime,
        firstHalfDuration: this.onboardinTaskForm.value.firstHalfDuration,
        secondHalfDuration: this.onboardinTaskForm.value.secondHalfDuration,
        shiftNature: this.onboardinTaskForm.value.shiftNature,
        offShift: this.onboardinTaskForm.value.offShift,
        deductingHours: this.onboardinTaskForm.value.deductingHours,
        minPreOTHours: this.onboardinTaskForm.value.minPreOTHours,
        minPostOTHours: this.onboardinTaskForm.value.minPostOTHours,
        maxPreOTHours: this.onboardinTaskForm.value.maxPreOTHours,
        maxPostOTHours: this.onboardinTaskForm.value.maxPostOTHours,
        description: this.onboardinTaskForm.value.description
      }).subscribe(data=>{
        this.closePopup()
        this.snackBar.open("New Shift Item Created","OK", {duration:3000})
      }, error => {
        console.log(error)
      })
    } else {
      this.onboardinTaskForm.markAllAsTouched();
    }
  }
}
