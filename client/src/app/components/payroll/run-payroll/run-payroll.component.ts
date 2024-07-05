import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeePayitemService } from 'src/app/services/employee-payitem.service';
import { EmployeesService } from 'src/app/services/employees.service';
import { PayrollReportService } from 'src/app/services/payroll-report.service';
import { SummaryReportService } from 'src/app/services/summary-report.service';
import { EmployeeModel } from 'src/app/shared/data-models/Employee.model';
import { SummaryReportModel } from 'src/app/shared/data-models/summary-report.model';

@Component({
  selector: 'app-run-payroll',
  templateUrl: './run-payroll.component.html',
  styleUrls: ['./run-payroll.component.scss']
})
export class RunPayrollComponent {
  employees: EmployeeModel[]=[];
  employeePayments: { id: string, email: string, name: string, amount: number }[] = [];

  isDisplayEmployeePayments = true;
  isDisplayEmployeePayItems = false;

  selectedEmployeeId: string = "";

  step: number = 1;
  endStep: number = 3;

  isError = false;
  isLoading = true;
  isPreparingPreview = false;

  totalSalaryOfTheSelectedEmployee: number = 0.0;
  selectedEmployeeBasicSalary: number = 0.0;

  payrollPreviewReport: SummaryReportModel = new SummaryReportModel();
  
  constructor(private employeesService: EmployeesService,
    private router: Router,
    private payrollReportService: PayrollReportService,
    private cookieService: AuthService,
    private employeePayitemService: EmployeePayitemService,
    private summaryReportService: SummaryReportService
  ) { }

  async ngOnInit(): Promise<any> {
    this.payrollReportService.generateAllPayrollReportsByOrganizationId(this.cookieService.organization(), true).subscribe((res: any) => {
      this.loadAllEmployeesPayments();
    },(error: any) => {
      this.triggerError();
    })
  }

  loadAllUsers(): Observable<any>{
    return this.employeesService.getAllEmployees().pipe(
        tap(data => this.employees = data)
    );
  }

  loadAllEmployeesPayments(){
    this.employeePayments = [];

    this.loadAllUsers().subscribe(()=>{
      for(let employee of this.employees){
        this.totalSalaryOfTheSelectedEmployee = 0.0;
        this.isLoading = true;
    
        this.employeePayitemService.getPayItemsByEmail(employee.email).subscribe((res:any) =>{
          if(res){
    
              if (res.length > 0){
                this.selectedEmployeeBasicSalary = res[0].value;
              }

              this.employeePayitemService.calculateTotalSalaryOfTheSelectedEmployee(this.selectedEmployeeBasicSalary, res)
                .then(([employeePayitemsList, totalSalaryOfTheSelectedEmployee]) => {
                    if(totalSalaryOfTheSelectedEmployee < 0){
                      this.isError = true;
                    }else{
                      this.totalSalaryOfTheSelectedEmployee = totalSalaryOfTheSelectedEmployee;
                      this.employeePayments.push({ id: employee.id, email: employee.email, name: employee.name, amount: this.totalSalaryOfTheSelectedEmployee });
                    }
                })
                .catch(error => {
                    this.triggerError();
                    
                }).finally(() => {
                    this.isLoading = false;
                });
          }
    
        },(error: any) => {
          this.triggerError();
        })
      }
    })
  }

  displayEmployeePayitems(employeeId: string){
    this.selectedEmployeeId = employeeId;
    this.isDisplayEmployeePayments = false;
    this.isDisplayEmployeePayItems = true;
  }

  unselectEmployeeViewPayItems(){
    this.isDisplayEmployeePayments = true;
    this.isDisplayEmployeePayItems = false;
    this.loadAllEmployeesPayments();
  }

  generatePreview(){
    this.step = 2;
    this.isDisplayEmployeePayments = false;
    this.isDisplayEmployeePayItems = false;
    this.isPreparingPreview = true;

    this.payrollReportService.generateAllPayrollReportsByOrganizationId(this.cookieService.organization(), true).subscribe((res: any) => {
      if(res){
        this.summaryReportService.getAllSummaryReportsByOrganizationId(this.cookieService.organization()).subscribe((summaryReportsRes:any) =>{
          if(summaryReportsRes){
            this.payrollPreviewReport = summaryReportsRes[0];
            this.isPreparingPreview = false;
          }
    
        },(error: any) => {
          this.isPreparingPreview = false;
          this.triggerError();
        })
      }
    },(error: any) => {
      this.isPreparingPreview = false;
      this.triggerError();
    })
  }

  triggerError(){
    this.step = 0;
    this.isError = true;
  }

  goToStep(step: number){
      if(step == 1){
        this.step = 1;
        this.isDisplayEmployeePayments = true;
        this.isDisplayEmployeePayItems = false;
      }
  }

  submitPayroll(){
      this.step = 3;
      this.isDisplayEmployeePayments = false;
      this.isDisplayEmployeePayItems = false;

      this.payrollReportService.generateAllPayrollReportsByOrganizationId(this.cookieService.organization()).subscribe((res: any) => {},(error: any) => {
        this.triggerError();
      })
  }

  cancelPayroll(){
    this.router.navigate(['payroll', 'payroll-configuration']);
  }

  finishPayroll(){
    this.router.navigate(['payroll', 'payroll-configuration']);
  }
}
