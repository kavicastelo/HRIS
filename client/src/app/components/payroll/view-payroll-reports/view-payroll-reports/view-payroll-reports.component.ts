import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { EmployeesService } from 'src/app/services/employees.service';
import { PayrollReportService } from 'src/app/services/payroll-report.service';
import { EmployeeModel } from 'src/app/shared/data-models/Employee.model';
import { PayrollReportModel } from 'src/app/shared/data-models/payroll-report.model';

@Component({
  selector: 'app-view-payroll-reports',
  templateUrl: './view-payroll-reports.component.html',
  styleUrls: ['./view-payroll-reports.component.scss']
})
export class ViewPayrollReportsComponent {
  employeePayrollReportsTableColumns: string[] = ['reportType', 'payPeriod', 'totalEarnings', 'totalDeductions', 'netPay', 'reportGeneratedDate', 'status'];
  employeePayrollReportsTabledataSource = new MatTableDataSource<PayrollReportModel>([]);

  isEmployee = false;

  constructor(private dialog: MatDialog,
    private payrollReportsService: PayrollReportService,
    private employeesService: EmployeesService,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.employeesService.getEmployeeById(this.route.snapshot.params['id']).subscribe(res => {
      this.viewEmployeeReports(res);
    });
  };

  viewEmployeeReports(employeeModel: EmployeeModel){

    this.payrollReportsService.getAllPayrollReportsByEmail(employeeModel.email).subscribe((res:any) =>{
      if(res){

        if(this.isEmployee){
          for(let payrollReport of res){
            if(payrollReport.status == "Pending approval"){
              payrollReport.id = "";
              payrollReport.totalEarnings = 0.0;
              payrollReport.totalDeductions = 0.0;
              payrollReport.netPay = 0.0;
            }else if(payrollReport.status == "Rejected"){
              payrollReport.id = "";
            }
          }
        }

        this.employeePayrollReportsTabledataSource.data = res;
      }

    },(error: any) => {})
  }

  getReportStatusClass(status: string): string {
    switch (status) {
      case 'Pending approval':
        return 'pendingApproval';
      case 'Approved':
        return 'approved';
      case 'Rejected':
        return 'rejected';
      default:
        return '';
    }
  }
}
