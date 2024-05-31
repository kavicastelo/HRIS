import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { EmployeePayitemService } from 'src/app/services/employee-payitem.service';
import { EmployeesService } from 'src/app/services/employees.service';
import { PayitemService } from 'src/app/services/payitem.service';
import { EmployeeModel } from 'src/app/shared/data-models/Employee.model';
import { EmployeePayItemModel } from 'src/app/shared/data-models/employee-payitem.model';
import { PayItemModel } from 'src/app/shared/data-models/payitem.model';

@Component({
  selector: 'app-view-employee-payitems',
  templateUrl: './view-employee-payitems.component.html',
  styleUrls: ['./view-employee-payitems.component.scss']
})
export class ViewEmployeePayitemsComponent {

  employeePayitemModel!: EmployeePayItemModel;

  totalSalaryOfTheSelectedEmployee: number = 0.0;

  payItemsList: PayItemModel[] = [];
  employeePayitemsList: EmployeePayItemModel[] = [];

  selectedEmployeeBasicSalary: number = 0.0;

  notfoundError = false;

  constructor(private employeePayitemService: EmployeePayitemService,
    private payitemService: PayitemService,
    private route: ActivatedRoute,
    private employeesService: EmployeesService
  ){}

  ngOnInit(): void {
      this.employeesService.getEmployeeById(this.route.snapshot.params['id']).subscribe(res => {
        this.viewEmployeePaymentDetails(res);
      },(error: any) => {
        this.notfoundError = true;
      });
  };


    viewEmployeePaymentDetails(employeeModel: EmployeeModel){
      this.totalSalaryOfTheSelectedEmployee = 0.0;
  
      // this.resetAssignPayitemForm();
  
      this.employeePayitemService.getPayItemsByEmail(employeeModel.email).subscribe((res:any) =>{
        if(res){
  
            if (res.length > 0){
              this.selectedEmployeeBasicSalary = res[0].value;
            }
  
            for(let employeePayitem of res){
              
              this.payitemService.getPayItemById(employeePayitem.payItemId).subscribe((payitemRes:any) =>{
                if(payitemRes){
                  
                      employeePayitem.payitem = payitemRes;
  
                      if(employeePayitem.type == "Percentage"){
                        employeePayitem.amount = this.selectedEmployeeBasicSalary * (employeePayitem.value/100);
                      }else if(employeePayitem.type == "Hourly Rate"){              
                          // employeePayitem.amount = employeePayitem.value * parseFloat(hoursWorkedRes.toString());
                      }else{
                        employeePayitem.amount = employeePayitem.value;
                      }
  
                      if(employeePayitem.payitem.itemType == "Deletion"){
                        this.totalSalaryOfTheSelectedEmployee -= employeePayitem.amount;
                      }else{
                        this.totalSalaryOfTheSelectedEmployee += employeePayitem.amount;
                      }
                }
          
              },(error: any) => {})
  
            }
  
            this.employeePayitemsList = res;
        }
  
      },(error: any) => {})
    }
}
