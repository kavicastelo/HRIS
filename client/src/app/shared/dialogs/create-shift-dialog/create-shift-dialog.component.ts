import {Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MultimediaService} from "../../../services/multimedia.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

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
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<CreateShiftDialogComponent>) {
  }

  async ngOnInit(): Promise<any> {
    this.receivedData = this.data;

    this.createForm();
  }

  createForm() {
    this.onboardinTaskForm = this.formBuilder.group({
      name: ['', Validators.required],
      start: ['', [Validators.required, this.timeValidator]],
      end: ['', [Validators.required, this.timeValidator]],
      descriptionTask: ['', Validators.required]
    });
  }

  timeValidator(control:any) {
    const valid = /^(0?[1-9]|1[0-2])\.\d{2} (AM|PM)$/.test(control.value);
    return valid ? null : { invalidTime: true };
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
}
