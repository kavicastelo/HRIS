import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { EmployeePayItemModel } from '../shared/data-models/employee-payitem.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeePayitemService {

  baseUrl = environment.baseUrl;
  
  constructor(private http : HttpClient) { }

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

}
