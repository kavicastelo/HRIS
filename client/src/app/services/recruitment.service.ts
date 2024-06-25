import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RecruitmentService {

  baseUrl = environment.baseUrl
  constructor(private http: HttpClient) { }

  getAllApplicants(): Observable<any> {
    return this.http.get(`${this.baseUrl}recruiter/details`);
  }

  downloadCV(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}recruiter/download/${id}`);
  }

  setFavorite(id: any): Observable<any> {
    return this.http.post(`${this.baseUrl}recruiter/favorite/${id}`, {});
  }
}
