import { Component } from '@angular/core';
import { EmployeeModel } from 'src/app/shared/data-models/Employee.model';
import { employeeDataStore } from 'src/app/shared/data-stores/employee-data-store';

@Component({
  selector: 'app-payitems',
  templateUrl: './payitems.component.html',
  styleUrls: ['./payitems.component.scss']
})
export class PayitemsComponent {

  employees: EmployeeModel[]=[];
  
  constructor() { }

  ngOnInit(): void {
  
    this.employees = employeeDataStore;
  }
  
}
