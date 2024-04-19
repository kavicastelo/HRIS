import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService) { }

  public createUserID(token:any){
    this.cookieService.set('user-token-id',token,60*60*24*7);
  }

  public createAdmin(token:string){
    this.cookieService.set('admin-token',token,60*60*24*7);
  }

  public logout(){
    this.cookieService.delete('user-token-id');
  }

  public logoutAdmin(){
    this.cookieService.delete('admin-token');
  }

  public isExists():boolean{
    let user = this.cookieService.get('user-token-id');
    return user.length !== 0; //user.length === 0?false:true
  }

  public isAdmin():boolean{
    let admin = this.cookieService.get('admin-token');
    return admin.length !== 0;
  }

  public profileName() {
    return this.cookieService.get('profile-name').toString();
  }

  public profileEmail() {
    return this.cookieService.get('profile-email').toString();
  }

  public profilePicture() {
    return this.cookieService.get('profile-picture').toString();
  }

  public profileFamilyName() {
    return this.cookieService.get('profile-family-name').toString();
  }

  public userEmail() {
    return this.cookieService.get('user-token').toString();
  }

  public userID() {
    return this.cookieService.get('user-token-id').toString();
  }

  public adminEmail() {
    return this.cookieService.get('admin-token').toString();
  }

  public userProfile() {
    return this.cookieService.get('profile-token').toString();
  }

  public acceptAllCookies() {
    this.cookieService.set('cookies-accepted', 'true', 60*60*24*20);
  }

  public necessaryCookiesOnly() {
    this.cookieService.set('cookies-accepted', 'false', 60*60*24*20);
  }

  public isCookiesAccepted() {
    let cookie = this.cookieService.get('cookies-accepted');
    return cookie.length !== 0;
  }

}