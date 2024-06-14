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
  employeeExceptions: String[] = [];

  valueType: String = "Amount";
  value!: number;

  notfoundError = false;

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
    
    this.payitemService.getPayItemById(this.route.snapshot.params['payitemId']).subscribe((res:any) => {
      this.selectedPayItem = res;

      if(this.selectedPayItem.description == ""){
        this.selectedPayItem.description = "N/A";
      }

      // Load employees in the organization.
      this.loadAllUsers().subscribe(()=>{
          this.loadAllAlreadyAssignedEmployees();
      });
    },(error: any) => {
      this.notfoundError = true;
    });
  }

  loadAllAlreadyAssignedEmployees(){
    this.employeePayitemService.getAssignedEmployeesByPayitemId(this.selectedPayItem.id).subscribe((assignedEmployeesRes:any) =>{
      if(assignedEmployeesRes){
        this.employeeExceptions = assignedEmployeesRes;

        for(let employee of this.employees){
            if(assignedEmployeesRes.includes(employee.email)){
              this.toggleEmployeeSelection(employee);
            }
        }
      }
    },(error: any) => {})
  }

  loadAllUsers(): Observable<any>{
    return this.employeesService.getAllEmployees().pipe(
        tap(data => this.employees = data)
    );
  }

  toggleAllEmployeesSelection(){
    if(this.selectedEmployees.length == this.employees.length){
      this.selectedEmployees = [];
    } else {
      for(let employee of this.employees){
        if(!this.selectedEmployees.includes(employee)){
          this.selectedEmployees.push(employee);
        }
      }
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

    if(this.value === undefined || this.value < 1){
      this._snackBar.open("Invalid or out of range value/price. Please recheck the details and try again.", "Dismiss");
      return;
    }

    for(let employee of this.selectedEmployees){
        if(!this.employeeExceptions.includes(employee.email)){
          let employeePayitem = new EmployeePayItemModel();
          employeePayitem.email = employee.email;
          employeePayitem.payItemId = this.selectedPayItem.id;
          employeePayitem.type = this.valueType;
          employeePayitem.value = this.value;

          employeePayitemsList.push(employeePayitem);
        }
    }

    this._snackBar.open("Assigning the payitem...", "Dismiss", {duration: 5 * 1000});

    if(employeePayitemsList.length == 0){
      this._snackBar.open("No changes exist to save.", "Dismiss", {duration: 5 * 1000});
      return;
    }

    this.employeePayitemService.assignPayItemForMultipleEmployees(employeePayitemsList).subscribe((res: any) => {
      if(res){
        if(res.errorCode == "DUPLICATED_INFOMARTION"){
          this._snackBar.open(res.message, "Ok");
        }else{
          // Reload the content with saved changes.
          this.selectedEmployees = [];
          this.employeeExceptions = [];
          this.loadAllUsers().subscribe(()=>{
            this.loadAllAlreadyAssignedEmployees();
          });
          this._snackBar.open(res.message, "Dismiss", {duration: 5 * 1000});
        }
      }
    },(error: any) => {
      this._snackBar.open("Failed to assign the payitem.", "Dismiss", {duration: 5 * 1000});
    })
  }
}
