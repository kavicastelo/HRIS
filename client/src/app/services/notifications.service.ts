import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {NotificationModel} from "../shared/data-models/Notification.model";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  public getAllNotifications(): Observable<any> {
    return this.http.get(this.baseUrl+'notifications/get/all');
  }

  public saveNotification(notificationModel: NotificationModel): Observable<any> {
    return this.http.post(this.baseUrl+'notifications/save', notificationModel);
  }

  public updateStatus(id: any): Observable<any> {
    return this.http.put(this.baseUrl+'notifications/update/status/'+id, {});
  }

  public deleteNotification(id: any): Observable<any> {
    return this.http.delete(this.baseUrl+'notifications/delete/id/'+id);
  }
}
