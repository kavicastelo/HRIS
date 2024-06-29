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
  payrollStartDate: string = "";
  payrollEndDate: string = "";

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

        // this.payrollStartDate = this.formatDate(
        //   new Date(this.today.getFullYear(), this.today.getMonth()-1, this.payrollConfigurationModel.payrollPeriodStartDate)
        // );

        // this.payrollEndDate = this.formatDate(
        //   new Date(this.today.getFullYear(), this.today.getMonth(), this.payrollConfigurationModel.payrollPeriodStartDate)
        // );

        // const differenceInDays = Math.floor((new Date(this.today.getFullYear(), this.today.getMonth(), this.payrollConfigurationModel.payrollPeriodStartDate).getTime() 
        //   - new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.payrollConfigurationModel.payrollPeriodStartDate).getTime()) / (1000 * 60 * 60 * 24));

        // console.log('Difference in days:', differenceInDays);

        // this.datesLeftForThePayrollDeadline = this.payrollConfigurationModel.deadlineToRunPayroll - this.today.getDate();
      }
    },(error: any) => {
      
    });
  }

  private getMonthName(monthIndex: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthIndex];
  }

  private formatDate(date: Date): string {
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
