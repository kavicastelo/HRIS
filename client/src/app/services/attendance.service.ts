import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {AttendanceModel} from "../shared/data-models/Attendance.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  baseUrl = environment.baseUrl
  constructor(private http: HttpClient) { }

  public saveAttendance(attendance: AttendanceModel): Observable<any> {
    return this.http.post(this.baseUrl+'attendance/create',attendance);
  }

  public departAttendance(id: any, a : AttendanceModel): Observable<any> {
    return this.http.put(this.baseUrl+'attendance/depart/'+id, a);
  }

  public getAllAttendance(): Observable<any> {
    return this.http.get(this.baseUrl+'attendance/get/all');
  }
}
