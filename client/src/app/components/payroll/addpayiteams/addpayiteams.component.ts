import { Component, OnInit } from '@angular/core';
import { employeeDataStore } from "../../../shared/data-stores/employee-data-store";
import { EmployeeModel } from 'src/app/shared/data-models/Employee.model';
import { MatFormFieldControl } from "@angular/material/form-field";

@Component({
  
  selector: 'app-addpayiteams',
  templateUrl: './addpayiteams.component.html',
  styleUrls: ['./addpayiteams.component.scss']
})
export class AddpayiteamsComponent implements OnInit {

  employees: EmployeeModel[]=[];
  
  constructor() { }

  ngOnInit(): void {
  
    this.employees = employeeDataStore;
  }

}
