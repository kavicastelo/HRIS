import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {EmployeeModel} from "../shared/data-models/Employee.model";

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public getAllEmployees(): Observable<any> {
    return this.http.get(this.baseUrl + 'employee/get/all');
  }

  public getEmployeeById(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'employee/get/id/' + id);
  }

  public getEmployeeByEmail(email: string): Observable<any> {
    return this.http.get(this.baseUrl + 'employee/get/email/' + email);
  }

  public addEmployee(employeeModel: EmployeeModel): Observable<any> {
    return this.http.post(this.baseUrl + 'employee/save', {
      name: employeeModel.name,
      email: employeeModel.email,
      phone: employeeModel.phone,
      address: employeeModel.address,
      organizationId: employeeModel.organizationId,
      departmentId: employeeModel.departmentId,
      channels: employeeModel.channels,
      jobData: employeeModel.jobData,
      gender: employeeModel.gender,
      dob: employeeModel.dob,
      photo: employeeModel.photo,
      status: employeeModel.status,
      level: employeeModel.level
    });
  }

  public updateEmployeeById(id: string, employeeModel: EmployeeModel): Observable<any> {
    return this.http.put(this.baseUrl + 'employee/update/id/' + id, {
      name: employeeModel.name,
      email: employeeModel.email,
      phone: employeeModel.phone,
      address: employeeModel.address,
      organizationId: employeeModel.organizationId,
      departmentId: employeeModel.departmentId,
      channels: employeeModel.channels,
      jobData: employeeModel.jobData,
      gender: employeeModel.gender,
      dob: employeeModel.dob,
      photo: employeeModel.photo,
      status: employeeModel.status,
      level: employeeModel.level
    });
  }

  public updateEmployeeByEmail(email: string, employeeModel: EmployeeModel): Observable<any> {
    return this.http.put(this.baseUrl + 'employee/update/email/' + email, {
      name: employeeModel.name,
      email: employeeModel.email,
      phone: employeeModel.phone,
      address: employeeModel.address,
      organizationId: employeeModel.organizationId,
      departmentId: employeeModel.departmentId,
      channels: employeeModel.channels,
      jobData: employeeModel.jobData,
      gender: employeeModel.gender,
      dob: employeeModel.dob,
      photo: employeeModel.photo,
      status: employeeModel.status,
      level: employeeModel.level
    });
  }

  public deleteEmployeeById(id: string): Observable<any> {
    return this.http.delete(this.baseUrl + 'employee/delete/id/' + id);
  }

  public deleteEmployeeByEmail(email: string): Observable<any> {
    return this.http.delete(this.baseUrl + 'employee/delete/email/' + email);
  }
}
