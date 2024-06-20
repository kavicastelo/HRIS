import {Component, ElementRef, Inject, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {MultimediaService} from "../../../services/multimedia.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ShiftsService} from "../../../services/shifts.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable, of} from "rxjs";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-create-shift-dialog',
  templateUrl: './create-shift-dialog.component.html',
  styleUrls: ['./create-shift-dialog.component.scss']
})
export class CreateShiftDialogComponent {

  receivedData:any;

  onboardinTaskForm: FormGroup | any;

  @ViewChildren('longNameInput, nameInput, startInput, endInput, durationInput, earliestInTimeInput, latestOutTimeInput, firstHalfDurationInput, secondHalfDurationInput, shiftNatureInput, offShiftInput, deductingHoursInput, minPreOTHoursInput, minPostOTHoursInput, maxPreOTHoursInput, maxPostOTHoursInput, descriptionInput')
  inputs: QueryList<ElementRef> | any;

  constructor(private multimediaService: MultimediaService,
              private dialog: MatDialog,
              private formBuilder: FormBuilder,
              private shiftService: ShiftsService,
              private snackBar: MatSnackBar,
              private renderer: Renderer2,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<CreateShiftDialogComponent>) {
  }

  async ngOnInit(): Promise<any> {
    this.receivedData = this.data;

    this.createForm();

    if (this.receivedData.data.id) {
      this.patchValue('name', this.receivedData.data.shift.name);
      this.patchValue('longName', this.receivedData.data.shift.longName);
      this.patchValue('start', this.receivedData.data.shift.startTime);
      this.patchValue('end', this.receivedData.data.shift.endTime);
      this.patchValue('duration', this.receivedData.data.shift.duration);
      this.patchValue('earliestInTime', this.receivedData.data.shift.earliestInTime);
      this.patchValue('latestOutTime', this.receivedData.data.shift.latestOutTime);
      this.patchValue('firstHalfDuration', this.receivedData.data.shift.firstHalfDuration);
      this.patchValue('secondHalfDuration', this.receivedData.data.shift.secondHalfDuration);
      this.patchValue('shiftNature', this.receivedData.data.shift.shiftNature);
      this.patchValue('offShift', this.receivedData.data.shift.offShift);
      this.patchValue('deductingHours', this.receivedData.data.shift.deductingHours);
      this.patchValue('minPreOTHours', this.receivedData.data.shift.minPreOTHours);
      this.patchValue('minPostOTHours', this.receivedData.data.shift.minPostOTHours);
      this.patchValue('maxPreOTHours', this.receivedData.data.shift.maxPreOTHours);
      this.patchValue('maxPostOTHours', this.receivedData.data.shift.maxPostOTHours);
      this.patchValue('description', this.receivedData.data.shift.description);
    }
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

  patchValue(key: string, value: any) {
    this.onboardinTaskForm.get(key).patchValue(value);
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

  editShift() {
    if (this.onboardinTaskForm.valid){
      this.shiftService.updateShift({
        organizationId: this.receivedData.data.organizationId,
        id: this.receivedData.data.id,
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
        this.snackBar.open("Shift Item Updated","OK", {duration:3000})
      }, error => {
        console.log(error)
      })
    }
  }

  focusFieldOnEnter(event: KeyboardEvent, nextField: any) {
    if (event.key === 'Enter') {
      if (nextField instanceof MatSelect) {
        nextField.open();
      } else {
        this.renderer.selectRootElement(nextField).focus();
      }
      event.preventDefault();
    }
  }

  keyFormSubmit(event: KeyboardEvent, method: any) {
    if (event.key === 'Enter' && !event.shiftKey) {
      // Prevent the default Enter key behavior (e.g., newline in textarea)
      event.preventDefault();

      // Perform the method
      if (method == 'edit'){
        this.editShift()
      }
      else if (method == 'save'){
        this.saveShift()
      }
    }
  }
}
