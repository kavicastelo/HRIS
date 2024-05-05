import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SharesModel} from "../shared/data-models/Shares.model";

@Injectable({
  providedIn: 'root'
})
export class SharesService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public saveShare(shareModel: SharesModel):Observable<any> {
    return this.http.post(this.baseUrl+'share/save', shareModel)
  }

  public getAllShares():Observable<any> {
    return this.http.get(this.baseUrl+'share/get/all')
  }

  public getShareById(id: string):Observable<any> {
    return this.http.get(this.baseUrl+'share/get/id/'+id)
  }
}
