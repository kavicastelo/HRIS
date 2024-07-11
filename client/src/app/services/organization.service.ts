import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  baseUrl = environment.baseUrl
  constructor(private http: HttpClient) { }

  getOrganizationById(id:any): Observable<any> {
    return this.http.get(this.baseUrl+'organization/get/id/'+id)
  }

  updateOrganization(id:any, data:any): Observable<any> {
    return this.http.put(this.baseUrl+'organization/update/id/'+id,data)
  }

  updateLeaveCounts(id:any, data:any): Observable<any> {
    return this.http.put(this.baseUrl+'organization/updateLeaves/'+id,data)
  }
}
