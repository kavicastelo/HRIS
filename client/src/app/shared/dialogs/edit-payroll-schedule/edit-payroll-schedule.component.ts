import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PayrollConfigurationModel } from '../../data-models/payroll-configuration.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-payroll-schedule',
  templateUrl: './edit-payroll-schedule.component.html',
  styleUrls: ['./edit-payroll-schedule.component.scss'],
  providers: [DatePipe]
})
export class EditPayrollScheduleComponent {
  
  payrollConfigurationModel: PayrollConfigurationModel = new PayrollConfigurationModel();
  days: number[] = [];

  payrollScheduleFormGroup = this._formBuilder.group({
    payrollFrequencyCtrl: ['', Validators.required],
    payrollPeriodStartDateCtrl: ['', Validators.required],
    payrollPeriodInDaysCtrl: ['', Validators.required],
    daysToRunPayrollCtrl: ['', Validators.required],
    daysToPaydayCtrl: ['', Validators.required]
  });

  constructor(
    public popupDialogRef: MatDialogRef<EditPayrollScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe
  ){
    this.payrollConfigurationModel = data.payrollConfigurationModel;
    this.updateDateFields();

    this.days = Array.from({ length: 31 }, (_, i) => i + 1);
  }

  onNoClick(): void {
    this.popupDialogRef.close();
  }

  formatDate(): void {
    const selectedDate = this.payrollScheduleFormGroup.get('payrollPeriodStartDateCtrl')!.value;
    
    if (selectedDate !== null) {
      const formattedDate = this.datePipe.transform(selectedDate, 'MM/dd/YYYY');
      if (formattedDate !== null) 
        this.payrollConfigurationModel.payrollPeriodStartDate = formattedDate;
    }
  }

  updateDateFields(): void{
    const parts = this.payrollConfigurationModel.payrollPeriodStartDate.split('/');
    this.payrollScheduleFormGroup.get('payrollPeriodStartDateCtrl')?.setValue(new Date(+parts[2], +parts[0] - 1, +parts[1] + 1).toISOString().slice(0, 10)); // slice(0, 10) extract only the date portion without including the time part.
  }
}
