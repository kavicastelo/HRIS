import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeesService } from 'src/app/services/employees.service';
import { PayrollReportService } from 'src/app/services/payroll-report.service';
import { EmployeeModel } from 'src/app/shared/data-models/Employee.model';

@Component({
  selector: 'app-run-payroll',
  templateUrl: './run-payroll.component.html',
  styleUrls: ['./run-payroll.component.scss']
})
export class RunPayrollComponent {
  employees: EmployeeModel[]=[];

  isDisplayEmployeePayments = true;
  isDisplayEmployeePayItems = false;

  selectedEmployeeId: string = "";

  step: number = 1;
  endStep: number = 2;
  
  constructor(private employeesService: EmployeesService,
    private router: Router,
    private payrollReportService: PayrollReportService,
    private cookieService: AuthService
  ) { }

  async ngOnInit(): Promise<any> {
    this.loadAllUsers().subscribe(()=>{})
  }

  loadAllUsers(): Observable<any>{
    return this.employeesService.getAllEmployees().pipe(
        tap(data => this.employees = data)
    );
  }

  displayEmployeePayitems(employeeId: string){
    this.selectedEmployeeId = employeeId;
    this.isDisplayEmployeePayments = false;
    this.isDisplayEmployeePayItems = true;
  }

  unselectEmployeeViewPayItems(){
    this.isDisplayEmployeePayments = true;
    this.isDisplayEmployeePayItems = false;
  }

  submitPayroll(){
      this.step = 2;
      this.isDisplayEmployeePayments = false;
      this.isDisplayEmployeePayItems = false;

      this.payrollReportService.generateAllPayrollReportsByOrganizationId(this.cookieService.organization()).subscribe((res: any) => {},(error: any) => {})
  }

  cancelPayroll(){
    this.router.navigate(['payroll', 'payroll-configuration']);
  }

  finishPayroll(){
    this.router.navigate(['payroll', 'payroll-configuration']);
  }
}
