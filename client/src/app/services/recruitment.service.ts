import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {JobPostModel} from "../shared/data-models/jobPost.model";

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

  deleteApplicantById(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}recruiter/delete-candidate/${id}`);
  }

//   job post model
  saveJobPost(jobPost: JobPostModel): Observable<any> {
    return this.http.post(`${this.baseUrl}jobPost/save`, jobPost)
  }

  getAllJobPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}jobPost/get/all`);
  }
}
