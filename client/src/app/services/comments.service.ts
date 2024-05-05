import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CommentsModel} from "../shared/data-models/Comments.model";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  public getAllComments():Observable<any>{
    return this.http.get(this.baseUrl+'comment/get/all')
  }

  public saveComment(comment:CommentsModel):Observable<any>{
    return this.http.post(this.baseUrl+'comment/save',{
      userId: comment.userId,
      multimediaId: comment.multimediaId,
      comment: comment.comment,
      timestamp: comment.timestamp
    })
  }
}
