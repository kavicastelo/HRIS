import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ActivityModel} from "../shared/data-models/Activity.model";

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  public addActivity(activityModel:ActivityModel):Observable<any> {
    return this.http.post(this.baseUrl + 'activities/save', activityModel);
  }

  public toggleActivity(activityModel:ActivityModel):Observable<any> {
    return this.http.post(this.baseUrl + 'activities/toggle', activityModel);
  }

  public getAllActivities():Observable<any> {
    return this.http.get(this.baseUrl + 'activities/get/all');
  }

  public deleteActivityById(id: string):Observable<any> {
    return this.http.delete(this.baseUrl + 'activities/delete/id/' + id);
  }
}
