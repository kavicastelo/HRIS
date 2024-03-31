import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MessageModel} from "../shared/data-models/Message.model";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  public addMessage(messageModel: MessageModel): Observable<any> {
    return this.http.post(this.baseUrl + 'message/save', {
      userId: messageModel.userId,
      chatId: messageModel.chatId,
      content: messageModel.content,
      status: messageModel.status,
      timestamp: messageModel.timestamp
    });
  }

  public getAllChats(): Observable<any> {
    return this.http.get(this.baseUrl + 'chat/get/all');
  }
}
