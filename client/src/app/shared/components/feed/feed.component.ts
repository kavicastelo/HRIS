import {Component, OnInit} from '@angular/core';
import {employeeDataStore} from "../../data-stores/employee-data-store";
import {multimediaDataStore} from "../../data-stores/multimedia-data-store";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  employeeDataStore = employeeDataStore;
  multimediaDataStore = multimediaDataStore;
  employee: any;

  commentSection: boolean = true;

  feedPost: any[] = [
    {
      user: '',
      userPosition: '',
      userPhoto: '',
      time: '',
      message: '',
      file: '',
    }
  ];

  channelId:string = "65dcf6ea090f1d3b06e84806";
  feed:any;

  userId:string = "3";

  ngOnInit(): void {
    this.getUser();
    this.loadFeed();
    this.loadUsers();
  }

  loadUsers() {
  //  create service
  }

  getUser() {
    employeeDataStore.forEach((emp) => {
      if (emp.id == this.userId) {
        this.employee = [emp];
      }
    })
  }

  loadFeed() {
    this.feed = multimediaDataStore.filter(feed => (feed.channelId == this.channelId) ? this.feed = [feed] : null )

    this.feed.forEach((feed:any) => {
      this.employeeDataStore.forEach((emp) => {
        if (emp.id == feed.userId) {
          this.feedPost.push({
            user: emp.name,
            userPosition: emp.jobData.position,
            userPhoto: emp.photo,
            time: feed.timestamp,
            message: feed.title,
            file: feed.file,
          })
        }
      })
    })

    this.feedPost = this.feedPost.filter(time => (time.time != '') ? this.commentSection = true : false )
  }
}
