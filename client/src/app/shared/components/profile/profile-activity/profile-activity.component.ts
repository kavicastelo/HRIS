import {Component, OnInit} from '@angular/core';
import {activityDataStore} from "../../../data-stores/activity-data-store";
import {ActivatedRoute} from "@angular/router";
import {Observable, tap} from "rxjs";
import {ActivitiesService} from "../../../../services/activities.service";
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-profile-activity',
  templateUrl: './profile-activity.component.html',
  styleUrls: ['./profile-activity.component.scss']
})
export class ProfileActivityComponent implements OnInit{

  constructor(private route: ActivatedRoute, private cookieService: AuthService, private activitiesService: ActivitiesService) {
  }

  activityDataStore: any;

  userId: any;
  profileId:any;

  async ngOnInit(): Promise<any> {
    this.userId = this.cookieService.userID().toString();
    await this.loadAllActivities().subscribe(()=>{
      this.loadProfileId()
      this.loadActivities()
    })
  }

  loadAllActivities(): Observable<any>{
    return this.activitiesService.getAllActivities().pipe(
        tap(data => this.activityDataStore = data)
    );
  }

  loadProfileId(){
    this.route.paramMap.subscribe(params =>{
      this.profileId = params.get('id')
    })
  }

  loadActivities(){
    this.activityDataStore = this.activityDataStore.filter((feed:any) => (feed.userId == this.profileId) ? this.activityDataStore = [feed] : null )
    this.activityDataStore.sort((a: any, b: any) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(); // Reversed comparison logic
    })
  }

}
