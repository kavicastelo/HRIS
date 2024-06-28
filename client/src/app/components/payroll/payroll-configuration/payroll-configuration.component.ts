import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PayrollConfigurationService } from 'src/app/services/payroll-configuration.service';
import { PayrollReportService } from 'src/app/services/payroll-report.service';

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

  constructor(private payrollReportService: PayrollReportService,
    private cookieService: AuthService,
    private payrollConfigurationService: PayrollConfigurationService
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
    this.payrollConfigurationService.getPayrollConfigurationByOrganizationId(this.cookieService.organization()).subscribe((res:any) => {
      if(res){
        console.log(res);
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
}
