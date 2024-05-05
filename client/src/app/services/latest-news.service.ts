import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {NewsModel} from "../shared/data-models/News.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LatestNewsService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public saveNews(newsModel:NewsModel): Observable<any> {
    return this.http.post(this.baseUrl+'news/save', newsModel);
  }

  public getAllNews(): Observable<any> {
    return this.http.get(this.baseUrl+'news/get/all');
  }
}
