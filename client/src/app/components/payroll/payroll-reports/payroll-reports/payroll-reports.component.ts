import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeesService } from 'src/app/services/employees.service';
import { PayrollReportService } from 'src/app/services/payroll-report.service';
import { EmployeeModel } from 'src/app/shared/data-models/Employee.model';
import { PayrollReportModel } from 'src/app/shared/data-models/payroll-report.model';

@Component({
  selector: 'app-payroll-reports',
  templateUrl: './payroll-reports.component.html',
  styleUrls: ['./payroll-reports.component.scss']
})
export class PayrollReportsComponent {

    isReportsGeneratingProcessInProgress = false;

    employees: EmployeeModel[]=[];

    employeePayrollReportsTableColumns: string[] = ['reportType', 'payPeriod', 'totalEarnings', 'totalDeductions', 'netPay', 'reportGeneratedDate', 'status'];
    employeePayrollReportsTabledataSource = new MatTableDataSource<PayrollReportModel>([]);

    constructor(private payrollReportService: PayrollReportService,
      private cookieService: AuthService,
      private employeesService: EmployeesService
    ){}

    async ngOnInit(): Promise<any> {
      this.loadAllUsers().subscribe(()=>{})
    }
  
    loadAllUsers(): Observable<any>{
      return this.employeesService.getAllEmployees().pipe(
          tap(data => this.employees = data)
      );
    }
}
