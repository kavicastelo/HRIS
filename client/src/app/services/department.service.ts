import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  public addDepartment(departmentModel: any): Observable<any> {
    return this.http.post(this.baseUrl + 'department/save', {
      name: departmentModel.name,
      description: departmentModel.description,
      organizationId: departmentModel.organizationId
    });
  }

  public getAllDepartments(): Observable<any> {
    return this.http.get(this.baseUrl + 'department/get/all');
  }

  public getDepartmentById(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'department/get/id/' + id);
  }

  public getAllDepartmentsByOrganizationId(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'department/get/org/' + id);
  }

  public deleteDepartment(id: string): Observable<any> {
    return this.http.delete(this.baseUrl + 'department/delete/id/' + id);
  }
}
