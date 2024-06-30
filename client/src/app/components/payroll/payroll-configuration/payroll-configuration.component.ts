import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { PayrollConfigurationService } from 'src/app/services/payroll-configuration.service';
import { PayrollReportService } from 'src/app/services/payroll-report.service';
import { PayItemModel } from 'src/app/shared/data-models/payitem.model';
import { PayrollConfigurationModel } from 'src/app/shared/data-models/payroll-configuration.model';
import { EditPayrollScheduleComponent } from 'src/app/shared/dialogs/edit-payroll-schedule/edit-payroll-schedule.component';

@Component({
  selector: 'app-payroll-configuration',
  templateUrl: './payroll-configuration.component.html',
  styleUrls: ['./payroll-configuration.component.scss']
})
export class PayrollConfigurationComponent {
  
  isReportsGeneratingProcessInProgress = false;
  currentMonth: string;
  currentYear: number;
  startDate: string;
  endDate: string;

  payrollConfigurationModel: PayrollConfigurationModel = new PayrollConfigurationModel();
  payrollStartDateFormatted: string = "";
  payrollEndDateFormatted: string = "";

  payrollStartDate: Date = new Date();
  payrollEndDate: Date = new Date();
  payrollDeadline: Date = new Date();
  payDay: Date = new Date();

  datesLeftForThePayrollDeadline = 0;

  today = new Date();

  constructor(private payrollReportService: PayrollReportService,
    private cookieService: AuthService,
    private payrollConfigurationService: PayrollConfigurationService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ){
    const today = new Date();
    this.currentMonth = this.getMonthName(today.getMonth());
    this.currentYear = today.getFullYear();

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.startDate = this.formatDate(startOfMonth);

    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.endDate = this.formatDate(endOfMonth);
  }

  ngOnInit(): void {
    this.refreshPayrollConfigurationInfo();
  }

  refreshPayrollConfigurationInfo(){
    this.payrollConfigurationService.getPayrollConfigurationByOrganizationId(this.cookieService.organization()).subscribe((res:any) => {
      if(res){
        this.payrollConfigurationModel = res;

        this.payrollStartDate = new Date(this.payrollConfigurationModel.payrollPeriodStartDate);
        this.payrollStartDateFormatted = this.formatDate(this.payrollStartDate);

        this.payrollEndDate = new Date(this.payrollConfigurationModel.payrollPeriodStartDate);
        this.payrollEndDate.setDate(this.payrollEndDate.getDate() + Number(this.payrollConfigurationModel.payrollPeriodInDays) - 1);
        this.payrollEndDateFormatted = this.formatDate(this.payrollEndDate);
        
        this.payrollDeadline = new Date(this.payrollEndDate);
        this.payrollDeadline.setDate(this.payrollDeadline.getDate() + Number(this.payrollConfigurationModel.daysToRunPayroll));
        
        this.payDay = new Date(this.payrollDeadline);
        this.payDay.setDate(this.payDay.getDate() + Number(this.payrollConfigurationModel.daysToPayday));
        
        const currentDate = new Date();
        const timeDiff = this.payrollDeadline.getTime() - currentDate.getTime();
        this.datesLeftForThePayrollDeadline = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // this.datesLeftForThePayrollDeadline = 5;
      }
    },(error: any) => {
      
    });
  }

  getMonthName(monthIndex: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthIndex];
  }

  formatDate(date: Date): string {
    return `${this.getMonthName(date.getMonth())} ${date.getDate()}, ${date.getFullYear()}`;
  }

  runMonthlyPayrollProcess(){
    this.isReportsGeneratingProcessInProgress = true;

    this.payrollReportService.generateAllPayrollReportsByOrganizationId(this.cookieService.organization()).subscribe((res: any) => {},(error: any) => {})
  }

  editPayrollSchedule(payrollConfigurationModel: PayrollConfigurationModel){
    var payrollConfigurationModel = Object.assign(new PayrollConfigurationModel(), this.payrollConfigurationModel);
    const editPayitemDialogRef = this.dialog.open(EditPayrollScheduleComponent, {data: {payrollConfigurationModel}, width: '350px', maxHeight: '100%', enterAnimationDuration: '500ms', exitAnimationDuration: '500ms'});
  
    editPayitemDialogRef.afterClosed().subscribe(result => {
      if(result){
        this._snackBar.open("Updating the payroll schedule...", "Dismiss", {duration: 5 * 1000});
        payrollConfigurationModel = result;
        
        this.payrollConfigurationService.savePayrollConfiguration(payrollConfigurationModel).subscribe((res: any) => {
          if(res){
            if(res.errorCode == "INVALID_INFOMARTION"){
              this.editPayrollSchedule(payrollConfigurationModel);
              this._snackBar.open(res.message, "Ok");
            }else{
              this._snackBar.open(res.message, "Dismiss", {duration: 5 * 1000});
            }
            this.refreshPayrollConfigurationInfo();
          }
        },(error: any) => {
          this.editPayrollSchedule(payrollConfigurationModel);
          this._snackBar.open("Failed to update the payroll schedule.", "Ok");
        })
      }
    });
  }
}
