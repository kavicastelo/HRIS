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
  calendar1Matrix: number[][] = [];
  calendar2Matrix: number[][] = [];

  calendar1SelectedDates: number[] = [];
  calendar2SelectedDates: number[] = [];

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

    if(this.payrollConfigurationModel.payrollPeriodStartDate !== null || this.payrollConfigurationModel.payrollPeriodStartDate !== ""){
        const date = new Date(this.payrollConfigurationModel.payrollPeriodStartDate);
        this.renderCalendars(date);
    }else{
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      this.calendar1Matrix = this.generateCalendarMatrix(currentYear, currentMonth);
      this.calendar2Matrix = this.generateCalendarMatrix(currentYear, currentMonth + 1);
    }
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
        const date = new Date(selectedDate);
        this.renderCalendars(date);
    }
  }

  renderCalendars(date = new Date(this.payrollConfigurationModel.payrollPeriodStartDate)){
      this.calendar1Matrix = this.generateCalendarMatrix(date.getFullYear(), date.getMonth());
      this.calendar2Matrix = this.generateCalendarMatrix(date.getFullYear(), date.getMonth() + 1);

      const endDate = new Date(date);
      console.log(this.payrollConfigurationModel.payrollPeriodInDays);
      endDate.setDate(date.getDate() + Number(this.payrollConfigurationModel.payrollPeriodInDays) - 1);

      const datesArray = this.generateDateRangeArrays(date, endDate);
      this.calendar1SelectedDates = datesArray[0];
      this.calendar2SelectedDates = datesArray[1];
  }

  generateDateRangeArrays(startDate: Date, endDate: Date): [number[], number[]] {
    const calendar1Array: number[] = [];
    const calendar2Array: number[] = [];

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        if (date.getMonth() === startDate.getMonth()) {
            calendar1Array.push(date.getDate());
        } else {
            calendar2Array.push(date.getDate());
        }
    }

    return [calendar1Array, calendar2Array];
}

  updateDateFields(): void{
    const parts = this.payrollConfigurationModel.payrollPeriodStartDate.split('/');
    this.payrollScheduleFormGroup.get('payrollPeriodStartDateCtrl')?.setValue(new Date(+parts[2], +parts[0] - 1, +parts[1] + 1).toISOString().slice(0, 10)); // slice(0, 10) extract only the date portion without including the time part.
  }

  generateCalendarMatrix(year: number, month: number): number[][] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const numDays = lastDay.getDate();
    const matrix: number[][] = [];

    let currentRow: number[] = [];
    for (let day = 1; day <= numDays; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();

        if (dayOfWeek === 0 && currentRow.length > 0) {
          if(currentRow.length < 7){
            var currentRowCopy = currentRow;
            currentRowCopy.reverse();
            currentRow = [];

            var currentRowElemIndex = 6;
            for(let currentRowElem of currentRowCopy){
              currentRow[currentRowElemIndex] = currentRowElem;
              currentRowElemIndex--;
            }
          }
          matrix.push(currentRow);
          currentRow = [];
        }

        currentRow.push(day);

        if (day === numDays && currentRow.length > 0) {
            matrix.push(currentRow);
        }
    }

    return matrix;
  }
}
