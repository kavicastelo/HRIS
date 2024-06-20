import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TransferModel} from "../shared/data-models/Transfer.model";

@Injectable({
  providedIn: 'root'
})
export class TransferRequestService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  saveTransfer(transferModel:TransferModel): Observable<any> {
    return this.http.post(this.baseUrl+'transfer/save', transferModel);
  }

  getAllTransfer(): Observable<any> {
    return this.http.get(this.baseUrl+'transfer/get/all');
  }

  deleteTransfer(id: any): Observable<any> {
    return this.http.delete(this.baseUrl+'transfer/delete/id/'+id);
  }

  editTransfer(id: any, reason: any): Observable<any> {
    return this.http.put(this.baseUrl+'transfer/update/reason/'+id, {
      reason: reason
    })
  }

  changeStatus(id:any, data:any): Observable<any> {
    return this.http.put(this.baseUrl+'transfer/status/id/'+id,{
      jobData: data.jobData,
      approved: data.approved
    })
  }
}
