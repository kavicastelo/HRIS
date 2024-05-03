import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {LeaveModel} from "../shared/data-models/Leave.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  public saveLeave(leaveModel: LeaveModel):Observable<any> {
    return this.http.post(this.baseUrl+'leave/create',leaveModel);
  }

  public getAllLeaves(): Observable<any> {
    return this.http.get(this.baseUrl+'leave/all');
  }
}
