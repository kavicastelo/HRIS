import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { PayrollConfigurationModel } from '../shared/data-models/payroll-configuration.model';

@Injectable({
  providedIn: 'root'
})
export class PayrollConfigurationService {

  baseUrl = environment.baseUrl;
  
  constructor(private http : HttpClient) { }

  PayrollConfigurationController(payrollConfigurationModel: PayrollConfigurationModel){
    return this.http.post(this.baseUrl + "payroll-configuration/save", payrollConfigurationModel);
  }

  getPayrollConfigurationByOrganizationId(organizationId: any){
    return this.http.get(this.baseUrl + "payroll-configuration/get/organizationId/" + organizationId);
  }
  
}
