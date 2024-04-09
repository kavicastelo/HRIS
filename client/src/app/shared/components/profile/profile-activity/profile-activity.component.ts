import {Component, OnInit} from '@angular/core';
import {activityDataStore} from "../../../data-stores/activity-data-store";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-profile-activity',
  templateUrl: './profile-activity.component.html',
  styleUrls: ['./profile-activity.component.scss']
})
export class ProfileActivityComponent implements OnInit{

  constructor(private route: ActivatedRoute) {
  }

  activityDataStore: any = activityDataStore;

  userId: any;
  profileId:any;

  ngOnInit(): void {
    this.userId = localStorage.getItem('sender')
    this.loadProfileId()
    this.loadActivities()
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
