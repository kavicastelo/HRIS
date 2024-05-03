import { Component } from '@angular/core';
import { EmployeeModel } from 'src/app/shared/data-models/Employee.model';
import { employeeDataStore } from 'src/app/shared/data-stores/employee-data-store';

@Component({
  selector: 'app-assign-payitem',
  templateUrl: './assign-payitem.component.html',
  styleUrls: ['./assign-payitem.component.scss']
})
export class AssignPayitemComponent {

  employees: EmployeeModel[]=[];
  
  constructor() { }

  ngOnInit(): void {
  
    this.employees = employeeDataStore;
  }
  
}
