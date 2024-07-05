import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PayrollReportService {

  baseUrl = environment.baseUrl;
  
  constructor(private http : HttpClient) { }

  getAllPayrollReportsByEmail(email: String){
    return this.http.get(this.baseUrl + "payrollreport/get/all/email/" + email);
  }

  generateAllPayrollReportsByOrganizationId(organizationId: any, isPreCalculation: boolean = false){
    return this.http.post(this.baseUrl + "payrollreport/generate/organizationId/" + organizationId + "/isPreCalculation/" + isPreCalculation, null);
  }

  changeReportStatus(id:String, status: String){
    return this.http.put(this.baseUrl + "payrollreport/id/" + id + "/set-status", status);
  }

}
