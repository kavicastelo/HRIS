import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { EmployeesService } from 'src/app/services/employees.service';
import { PayitemService } from 'src/app/services/payitem.service';
import { EmployeeModel } from 'src/app/shared/data-models/Employee.model';
import { EmployeePayItemModel } from 'src/app/shared/data-models/employee-payitem.model';
import { PayItemModel } from 'src/app/shared/data-models/payitem.model';
import { employeeDataStore } from 'src/app/shared/data-stores/employee-data-store';
import { ViewEmployeePayitemsComponent } from '../../view-employee-payitems/view-employee-payitems/view-employee-payitems.component';
import { FormBuilder, Validators } from '@angular/forms';
import { EmployeePayitemService } from 'src/app/services/employee-payitem.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assign-payitem',
  templateUrl: './assign-payitem.component.html',
  styleUrls: ['./assign-payitem.component.scss']
})
export class AssignPayitemComponent {

  employees: EmployeeModel[]=[];
  selectedPayItem: PayItemModel = new PayItemModel();
  selectedEmployees: EmployeeModel[] = [];

  valueType: String = "Amount";
  value!: number;

  assignPayitemFormGroup = this._formBuilder.group({
    typeCtrl: ['', Validators.required],
    valueCtrl: ['', Validators.required]
  });
  
  constructor(private route: ActivatedRoute,
    private payitemService: PayitemService,
    private employeesService: EmployeesService,
    private employeePayitemService: EmployeePayitemService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  
    this.employees = employeeDataStore;
    
    this.payitemService.getPayItemById(this.route.snapshot.params['payitemId']).subscribe((res:any) => {
      this.selectedPayItem = res;

      if(this.selectedPayItem.description == ""){
        this.selectedPayItem.description = "N/A";
      }
    });

    this.loadAllUsers().subscribe(()=>{});
  }

  loadAllUsers(): Observable<any>{
    return this.employeesService.getAllEmployees().pipe(
        tap(data => this.employees = data)
    );
  }

  toggleAllEmployeesSelection(){
    for(let employee of this.employees){
      this.toggleEmployeeSelection(employee);
    }
  }

  toggleEmployeeSelection(employee: any) {
    if (this.isSelected(employee)) {
      this.selectedEmployees = this.selectedEmployees.filter(emp => emp !== employee);
    } else {
      this.selectedEmployees.push(employee);
    }
  }

  isSelected(employee: any): boolean {
    return this.selectedEmployees.indexOf(employee) > -1;
  }
  
  assignPayItemForMultipleEmployees(){

    let employeePayitemsList: EmployeePayItemModel[] = [];

    for(let employee of this.selectedEmployees){
        let employeePayitem = new EmployeePayItemModel();
        employeePayitem.email = employee.email;
        employeePayitem.payItemId = this.selectedPayItem.id;
        employeePayitem.type = this.valueType;
        employeePayitem.value = this.value;

        employeePayitemsList.push(employeePayitem);
    }

    this._snackBar.open("Assigning the payitem...", "Dismiss", {duration: 5 * 1000});

    this.employeePayitemService.assignPayItemForMultipleEmployees(employeePayitemsList).subscribe((res: any) => {
      if(res){
        if(res.errorCode == "DUPLICATED_INFOMARTION"){
          this._snackBar.open(res.message, "Ok");
        }else{
          this._snackBar.open(res.message, "Dismiss", {duration: 5 * 1000});
        }
      }
    },(error: any) => {
      this._snackBar.open("Failed to assign the payitem.", "Dismiss", {duration: 5 * 1000});
    })
  }
}
