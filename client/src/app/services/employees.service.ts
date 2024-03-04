import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

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

  public addEmployee(employeeModel: any): Observable<any> {
    return this.http.post(this.baseUrl + 'employee/save', employeeModel);
  }

  public updateEmployeeById(id: string, employeeModel: any): Observable<any> {
    return this.http.put(this.baseUrl + 'employee/update/id/' + id, employeeModel);
  }

  public updateEmployeeByEmail(email: string, employeeModel: any): Observable<any> {
    return this.http.put(this.baseUrl + 'employee/update/email/' + email, employeeModel);
  }

  public deleteEmployeeById(id: string): Observable<any> {
    return this.http.delete(this.baseUrl + 'employee/delete/id/' + id);
  }

  public deleteEmployeeByEmail(email: string): Observable<any> {
    return this.http.delete(this.baseUrl + 'employee/delete/email/' + email);
  }
}
