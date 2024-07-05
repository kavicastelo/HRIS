import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { EmployeePayItemModel } from '../shared/data-models/employee-payitem.model';
import { PayitemService } from './payitem.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeePayitemService {

  baseUrl = environment.baseUrl;
  
  constructor(private http : HttpClient, private payitemService: PayitemService) { }

  assignPayItem(employeePayitemModel: EmployeePayItemModel){
    return this.http.post(this.baseUrl + "employee/payitems/assign", employeePayitemModel);
  }

  assignPayItemForMultipleEmployees(employeePayitemsList: EmployeePayItemModel[]){
    return this.http.post(this.baseUrl + "employee/payitems/assign/multiple-employees", employeePayitemsList);
  }

  getAssignedEmployeesByPayitemId(payItemId: String){
    return this.http.get(this.baseUrl + "employee/payitems/get/assigned-employees/payItemId/" + payItemId);
  }
  
  getPayItemsByEmail(email: String){
    return this.http.get(this.baseUrl + "employee/payitems/get/email/" + email);
  }

  updateEmployeePayItem(employeePayitemModel: EmployeePayItemModel){
    return this.http.put(this.baseUrl + "employee/payitems/update/id/" + employeePayitemModel.id, employeePayitemModel);
  }

  removePayItemFromEmployee(id: String){
    return this.http.delete(this.baseUrl + "employee/payitems/delete/id/" + id);
  }

  async calculateTotalSalaryOfTheSelectedEmployee(selectedEmployeeBasicSalary: number, employeePayitemsList: EmployeePayItemModel[]): Promise<[EmployeePayItemModel[], number]> {
    var totalSalaryOfTheSelectedEmployee: number = 0.0;

    for(let employeePayitem of employeePayitemsList){
      try {        
      const payitemRes: any = await this.payitemService.getPayItemById(employeePayitem.payItemId).toPromise();
        if(payitemRes){
          
              employeePayitem.payitem = payitemRes;

              if(employeePayitem.type == "Percentage"){
                employeePayitem.amount = selectedEmployeeBasicSalary * (employeePayitem.value/100);
                employeePayitem.payitem.paymentType += " (" + employeePayitem.value + "% of basic)";
              }else if(employeePayitem.type == "Hourly Rate"){
                  // employeePayitem.amount = employeePayitem.value * parseFloat(hoursWorkedRes.toString());
                  employeePayitem.amount = 0.00;
                  employeePayitem.payitem.paymentType += " (" + employeePayitem.value + "% Hourly Rate)";
                }else{
                employeePayitem.amount = employeePayitem.value;
              }

              if(employeePayitem.payitem.itemType == "Deletion"){
                totalSalaryOfTheSelectedEmployee -= employeePayitem.amount;
              }else{
                totalSalaryOfTheSelectedEmployee += employeePayitem.amount;
              }
        }
        } catch (error) {
          totalSalaryOfTheSelectedEmployee = -1;
          return [employeePayitemsList, totalSalaryOfTheSelectedEmployee];
        }
      
    }

    return [employeePayitemsList, totalSalaryOfTheSelectedEmployee];
  }
}
