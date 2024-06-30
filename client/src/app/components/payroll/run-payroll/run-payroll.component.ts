import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { EmployeesService } from 'src/app/services/employees.service';
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
  
  constructor(private employeesService: EmployeesService,
    private router: Router
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
}
