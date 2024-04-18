import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {TransferModel} from "../shared/data-models/Transfer.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PromotionRequestService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  savePromotion(transferModel:TransferModel): Observable<any> {
    return this.http.post(this.baseUrl+'promotion/save', transferModel);
  }

  getAllPromotion(): Observable<any> {
    return this.http.get(this.baseUrl+'promotion/get/all');
  }

  deletePromotion(id: any): Observable<any> {
    return this.http.delete(this.baseUrl+'promotion/delete/id/'+id);
  }

  editPromotion(id: any, reason: any): Observable<any> {
    return this.http.put(this.baseUrl+'promotion/update/reason/'+id, {
      reason: reason
    })
  }
}
