import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {LikesModel} from "../shared/data-models/Likes.model";

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public getAllLikesByMultimediaId(id: string):Observable<any> {
    return this.http.get(this.baseUrl+'like/get/multimedia/'+id);
  }

  public getAllLikes():Observable<any> {
    return this.http.get(this.baseUrl+'like/get/all')
  }

  public toggleLike(likesModel: LikesModel):Observable<any> {
    return this.http.post(this.baseUrl+'like/toggle',likesModel)
  }
}
