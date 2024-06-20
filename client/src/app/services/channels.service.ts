import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ChannelsModel} from "../shared/data-models/Channels.model";

@Injectable({
  providedIn: 'root'
})
export class ChannelsService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public addChannel(channelModel: ChannelsModel): Observable<any> {
    return this.http.post(this.baseUrl + 'channel/save', {
      name: channelModel.name,
      description: channelModel.description,
      departmentId: channelModel.departmentId,
      photo: channelModel.photo
    });
  }

  public getAllChannels(): Observable<any> {
    return this.http.get(this.baseUrl + 'channel/get/all');
  }

  public getChannelById(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'channel/get/id/' + id);
  }

  public getChannelByDepartmentId(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'channel/get/dep/' + id);
  }

  public deleteChannel(id: string): Observable<any> {
    return this.http.delete(this.baseUrl + 'channel/delete/id/' + id);
  }

  public updateChannel(id: string, channelModel: any): Observable<any> {
    return this.http.put(this.baseUrl + 'channel/update/id/' + id, {
      name: channelModel.name,
      description: channelModel.description,
      departmentId: channelModel.departmentId,
      photo: channelModel.photo
    });
  }
}
