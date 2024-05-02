import { Component, OnInit } from '@angular/core';
import {employeeDataStore } from "../../shared/data-stores/employee-data-store";
import { EmployeeModel } from "../../shared/data-models/Employee.model";

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss']
})
export class PayrollComponent implements OnInit {

  employees: EmployeeModel[]=[];
  
  constructor() { }

  ngOnInit(): void {
  
    this.employees = employeeDataStore;
  }


   

}
