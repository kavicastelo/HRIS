import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {OnboardinPlan} from "../shared/data-models/OnboardinPlan";
import {Observable} from "rxjs";
import {Onboardin} from "../shared/data-models/Onboardin";

@Injectable({
  providedIn: 'root'
})
export class OnboardinService {

  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  public saveOnboardingPlan(plan: OnboardinPlan): Observable<any> {
    return this.http.post(this.baseUrl+'onboardingPlan/save',plan)
  }

  public saveOnboardin(onboarding: Onboardin): Observable<any> {
    return this.http.post(this.baseUrl+'onboarding/save', onboarding)
  }
}
