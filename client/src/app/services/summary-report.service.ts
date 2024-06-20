import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SummaryReportService {

  baseUrl = environment.baseUrl;
  
  constructor(private http : HttpClient) { }

  getAllSummaryReportsByOrganizationId(organizationId: String){
    return this.http.get(this.baseUrl + "summaryreport/get/all/organizationId/" + organizationId);
  }

}
