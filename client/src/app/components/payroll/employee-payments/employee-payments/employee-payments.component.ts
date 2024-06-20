import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
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

  navigatePath(path: string) {
    this.router.navigate([`/payroll/${path}/`]);
  }
  
}
