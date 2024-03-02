import {Component, OnInit} from '@angular/core';
import {employeeDataStore} from "../../data-stores/employee-data-store";
import {multimediaDataStore} from "../../data-stores/multimedia-data-store";
import {commentDataStore} from "../../data-stores/comment-data-store";
import {Parser} from "@angular/compiler";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  employeeDataStore = employeeDataStore;
  multimediaDataStore = multimediaDataStore;
  commentDataStore = commentDataStore;
  employee: any;
  comments: any[] = [];

  commentSection: boolean = true;

  feedPost: any[] = [
    {
      id: '',
      user: '',
      userPosition: '',
      userPhoto: '',
      time: '',
      message: '',
      file: '',
      likes: '',
      comments: '',
      shares: '',
    }
  ];

  comment:any[] = [
    {
      id: '',
      user: '',
      userProfile: '',
      comment: '',
      time: '',
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
            id: feed.id,
            user: emp.name,
            userPosition: emp.jobData.position,
            userPhoto: emp.photo,
            time: feed.timestamp,
            message: feed.title,
            file: feed.file,
            likes: feed.likes.length,
            comments: feed.comments.length,
            shares: feed.shares.length
          })
        }
      })
    })

    this.feedPost = this.feedPost.filter(time => (time.time != '') ? this.commentSection = true : false )
  }

  commentsForPost(id: any): any[] {
    const filteredComments = commentDataStore.filter(comment => comment.multimediaId == id);

    this.comments = filteredComments.map(comment => {
      const user = employeeDataStore.find(emp => emp.id.toString() === comment.userId);

      return {
        id: comment.id,
        user: user ? user.name : '',
        userProfile: user ? user.photo : '',
        comment: comment.comment,
        time: comment.timestamp,
      };
    });

    return this.comments;
  }
}
