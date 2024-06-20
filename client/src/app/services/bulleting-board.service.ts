import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BulletingBoardService {

  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  public saveBulletinBoard(formData: FormData, headers: HttpHeaders): void{
    this.http.post(this.baseUrl+'bullet-in-board/save', formData,{headers}).subscribe(
        response => {
          console.log(response)
        },
        error => {
          console.error('Error uploading employee data:', error);
        }
    )
  }

  public getAllBulletinBoards():Observable<any>{
    return this.http.get(this.baseUrl+'bullet-in-board/get/all')
  }

  uploadBulletin(form: FormData): void {
    const bgPhoto = form.get('bgPhoto') as File;
    const titlePhoto = form.get('titlePhoto') as File;

    const requestBody:any = {
      organizationId: sessionStorage.getItem('orgId'),
      departmentId: form.get('depId') as string,
      titleImage: titlePhoto,
      title: form.get('title') as string,
      message: form.get('msg') as string,
      redirectUrl: form.get('reUrl') as string,
      action: form.get('action') as string,
      backgroundImage: bgPhoto,
      stringBg: form.get('stringBg') as string,
      fontColor: sessionStorage.getItem('bulletin-color'),
      timestamp: new Date()
    };

    const formData = new FormData();
    for (const key in requestBody) {
      if (requestBody.hasOwnProperty(key)) {
        formData.append(key, requestBody[key]);
      }
    }

    // Set Content-Type header to multipart/form-data
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    this.saveBulletinBoard(formData, headers);
  }
}
