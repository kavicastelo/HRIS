import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { EmployeePayitemService } from 'src/app/services/employee-payitem.service';
import { EmployeesService } from 'src/app/services/employees.service';
import { EmployeeModel } from 'src/app/shared/data-models/Employee.model';
import { employeeDataStore } from 'src/app/shared/data-stores/employee-data-store';

@Component({
  selector: 'app-employee-payments',
  templateUrl: './employee-payments.component.html',
  styleUrls: ['./employee-payments.component.scss']
})
export class EmployeePaymentsComponent implements OnInit {

  employees: EmployeeModel[]=[];
  employeePayments: { id: string, email: string, name: string, amount: number }[] = [];

  isError = false;
  isLoading = true;

  totalSalaryOfTheSelectedEmployee: number = 0.0;
  selectedEmployeeBasicSalary: number = 0.0;
  
  constructor(private employeesService: EmployeesService,
    private router: Router,
    private employeePayitemService: EmployeePayitemService
  ) { }

  async ngOnInit(): Promise<any> {
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
                    this.isError = true;
                    
                }).finally(() => {
                    this.isLoading = false;
                });
          }
    
        },(error: any) => {
          this.isError = true;
        })
      }
    })
  }

  loadAllUsers(): Observable<any>{
    return this.employeesService.getAllEmployees().pipe(
        tap(data => this.employees = data)
    );
  }

  navigatePath(path: string) {
    this.router.navigate([`/payroll/${path}/`]);
  }
  
}
