import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public savePost(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'post/save', data);
  }
}
