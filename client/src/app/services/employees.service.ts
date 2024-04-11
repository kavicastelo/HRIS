import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {EmployeeModel} from "../shared/data-models/Employee.model";
import {NGXLogger} from "ngx-logger";

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private logger: NGXLogger) { }

  private sendToBackend(formData: FormData, headers: HttpHeaders): void {

    this.http.post(this.baseUrl + 'employee/save', formData, {headers}).subscribe(
      response => {
        console.log('Employee data uploaded successfully:', response);
      },
      error => {
        console.error('Error uploading employee data:', error);
      }
    );
  }

  public setActivityStatus(id: any, timestamp:any): Observable<any> {
    return this.http.put(this.baseUrl + 'employee/active/set-status/'+id,{
      lastSeen:timestamp
    });
  }

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

  // uploadEmployeeData(form: FormData): void {
  //   const fileInput = form.get('photo') as File;
  //   const jobData = form.get('jobData') as Object;
  //
  //   if (fileInput) {
  //     const formData = new FormData();
  //
  //     formData.append('name', form.get('name') as string);
  //     formData.append('email', form.get('email') as string);
  //     formData.append('phone', form.get('phone') as string);
  //     formData.append('address', form.get('address') as string);
  //     formData.append('organizationId', form.get('organizationId') as string);
  //     formData.append('departmentId', form.get('departmentId') as string);
  //     if (jobData instanceof Object) {
  //       formData.append('jobData', JSON.stringify(jobData));
  //     } else {
  //       formData.append('jobData', jobData);
  //     }
  //     console.log('jobData after stringify:', form.get('jobData'));
  //     formData.append('gender', form.get('gender') as string);
  //     formData.append('dob', form.get('dob') as string);
  //     formData.append('nic', form.get('nic') as string);
  //     formData.append('photo', fileInput);
  //     formData.append('status', form.get('status') as string);
  //     formData.append('level', form.get('level') as string);
  //
  //     // Call backend API to save employee data
  //     this.sendToBackend(formData);
  //   }
  // }

  uploadEmployeeData(form: FormData): void {
    const fileInput = form.get('photo') as File;

    if (fileInput) {
      const jobData = form.get('jobData') as Object;

      const requestBody:any = {
        name: form.get('name') as string,
        email: form.get('email') as string,
        phone: form.get('phone') as string,
        address: form.get('address') as string,
        organizationId: form.get('organizationId') as string,
        departmentId: form.get('departmentId') as string,
        jobData: sessionStorage.getItem('jobData'),
        gender: form.get('gender') as string,
        dob: form.get('dob') as string,
        nic: form.get('nic') as string,
        photo: fileInput,
        status: form.get('status') as string,
        level: form.get('level') as string,
      };

      const formData = new FormData();
      for (const key in requestBody) {
        if (requestBody.hasOwnProperty(key)) {
          if (key === 'jobData1') {
            formData.append(key, JSON.stringify(requestBody[key])); // Stringify jobData here
          } else {
            formData.append(key, requestBody[key]);
          }
        }
      }

      this.logger.info(requestBody.jobData);

      // Set Content-Type header to multipart/form-data
      const headers = new HttpHeaders();
      headers.set('Content-Type', 'multipart/form-data');

      // Call backend API to save employee data
      this.sendToBackend(formData, headers);
    }
  }
}
