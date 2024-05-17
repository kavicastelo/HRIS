import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ShiftModel} from "../shared/data-models/Shift.model";

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {

  baseUrl = environment.baseUrl
  constructor(private http: HttpClient) { }

  public getAllShifts(): Observable<any> {
    return this.http.get(this.baseUrl+'shifts/get/all');
  }

  public saveShift(shift: ShiftModel): Observable<any> {
    return this.http.post(this.baseUrl+'shifts/save',shift)
  }
}
