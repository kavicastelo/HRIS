import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeesService } from 'src/app/services/employees.service';
import { EmployeeModel } from 'src/app/shared/data-models/Employee.model';
import { EmployeePayItemModel } from 'src/app/shared/data-models/employee-payitem.model';
import { PayrollReportModel } from 'src/app/shared/data-models/payroll-report.model';
import { ViewPayrollReportsComponent } from '../view-payroll-reports/view-payroll-reports.component';
import { OrganizationService } from 'src/app/services/organization.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-view-payroll-report-dialog',
  templateUrl: './view-payroll-report-dialog.component.html',
  styleUrls: ['./view-payroll-report-dialog.component.scss']
})
export class ViewPayrollReportDialogComponent {
  payrollReportModel: PayrollReportModel;
  employeeModel!: EmployeeModel;
  
  organizationName: String = "N/A";
  organizationEmail: String = "N/A";
  organizationAddress: String = "N/A";

  additionsTableColumns: string[] = ['itemName', 'description', 'amount'];
  additionsTabledataSource = new MatTableDataSource<EmployeePayItemModel>([]);

  deductionsTableColumns: string[] = ['itemName', 'description', 'amount'];
  deductionsTabledataSource = new MatTableDataSource<EmployeePayItemModel>([]);

  additions: EmployeePayItemModel[] = [];
  deductions: EmployeePayItemModel[] = [];

  constructor(private dialog: MatDialog,
      public popupDialogRef: MatDialogRef<ViewPayrollReportsComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private employeeService: EmployeesService,
      private cookieService: AuthService,
      private organizationService: OrganizationService
  ){
    this.payrollReportModel = data.payrollReportModel;
  }

  ngOnInit(): void {
    this.organizationService.getOrganizationById(this.cookieService.organization()).subscribe((res:any) => {
      this.organizationName = res.organizationName;
      this.organizationAddress = res.address;
      this.organizationEmail = res.email;
    });

    this.employeeService.getEmployeeByEmail(this.payrollReportModel.email).subscribe((res: any) => {
      this.employeeModel = res!;
    });

    for(let addition of this.payrollReportModel.payItems){
      let employeePayItemModel = new EmployeePayItemModel();
      employeePayItemModel.payitem.itemName = addition.itemName;
      employeePayItemModel.payitem.description = addition.description;
      employeePayItemModel.amount = addition.amount;

      this.additions.push(employeePayItemModel);
    }

    for(let deduction of this.payrollReportModel.deductions){
      let employeePayItemModel = new EmployeePayItemModel();
      employeePayItemModel.payitem.itemName = deduction.itemName;
      employeePayItemModel.payitem.description = deduction.description;
      employeePayItemModel.amount = deduction.amount;

      this.deductions.push(employeePayItemModel);
    }

    this.additionsTabledataSource.data = this.additions;
    this.deductionsTabledataSource.data = this.deductions;
  }

  approveReport(){
    this.data.approvePayrollReport(this.payrollReportModel.id, 'Approved')
    this.payrollReportModel.status = "Approved";
  }

  rejectReport(){
    this.data.approvePayrollReport(this.payrollReportModel.id, 'Rejected')
    this.payrollReportModel.status = "Rejected";
  }
}
