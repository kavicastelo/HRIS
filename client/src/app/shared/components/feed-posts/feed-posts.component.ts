import {Component, OnInit} from '@angular/core';
import {ThemeService} from "../../../services/theme.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {MultimediaService} from "../../../services/multimedia.service";
import {NGXLogger} from "ngx-logger";
import {PopingListComponent} from "../feed/feed.component";
import {employeeDataStore} from "../../data-stores/employee-data-store";
import {multimediaDataStore} from "../../data-stores/multimedia-data-store";
import {commentDataStore} from "../../data-stores/comment-data-store";

@Component({
  selector: 'app-feed-posts',
  templateUrl: './feed-posts.component.html',
  styleUrls: ['./feed-posts.component.scss']
})
export class FeedPostsComponent implements OnInit{
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
      userId: '',
      userPosition: '',
      userPhoto: '',
      time: '',
      message: '',
      file: '',
      type: '',
      likes: '',
      likers: '',
      comments: '',
      commenters: '',
      shares: '',
      sharing: '',
    }
  ];

  comment:any[] = [
    {
      id: '',
      user: '',
      userId: '',
      userProfile: '',
      comment: '',
      time: '',
    }
  ];

  channelId:string = "65dcf6ea090f1d3b06e84806";
  feed:any;

  userId:any;

  constructor(private themeService: ThemeService,
              private dialog: MatDialog,
              private router: Router,
              private multimediaService: MultimediaService,
              private route: ActivatedRoute,
              private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.getUser();
    this.loadFeed();
    this.loadUsers();
    this.hideCommentSection();
  }

  loadUsers() {
    //  create service
  }

  hideCommentSection() {
    this.route.paramMap.subscribe(params => {
      if(params.get('id')) {
        this.commentSection = false;
      }
    })
  }

  getUser() {
    this.userId = localStorage.getItem('sender');
    employeeDataStore.forEach((emp) => {
      if (emp.id == this.userId) {
        this.employee = [emp];
      }
    })
  }

  loadFeed() {
    if (this.router.url == '/feed/area') {
      this.feed = multimediaDataStore.filter(feed => (feed.channelId == this.channelId) ? this.feed = [feed] : null )
    }
    else{
      const id = this.router.url.split('/')[2];
      this.feed = multimediaDataStore.filter(feed => (feed.userId == id) ? this.feed = [feed] : null )
    }

    this.feed.forEach((feed:any) => {
      this.employeeDataStore.forEach((emp) => {
        if (emp.id == feed.userId) {
          this.feedPost.push({
            id: feed.id,
            user: emp.name,
            userId: emp.id,
            userPosition: emp.jobData.position,
            userPhoto: emp.photo,
            time: feed.timestamp,
            message: feed.title,
            file: this.multimediaService.convertToSafeUrl(feed.file, feed.contentType),
            type: feed.contentType,
            likes: feed.likes.length,
            likers: feed.likes,
            comments: feed.comments.length,
            commenters: feed.comments,
            shares: feed.shares.length,
            sharing: feed.shares
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
        userId: user ? user.id : '',
        userProfile: user ? user.photo : '',
        comment: comment.comment,
        time: comment.timestamp,
      };
    });

    return this.comments;
  }

  openLikes(likers: any) {
    let whoLikes:any[] = [];
    likers.forEach((liker: any) => {
      employeeDataStore.forEach((emp) => {
        if (emp.id == liker) {
          whoLikes.push(emp);
        }
      })
    })
    const dialogRef = this.dialog.open(PopingListComponent, {
      data: {data:whoLikes}
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
    });
  }

  openComments(commenters: any) {
    let whoComments:any[] = [];
    commenters.forEach((commenter: any) => {
      employeeDataStore.forEach((emp) => {
        if (emp.id == commenter) {
          whoComments.push(emp);
        }
      })
    })
    const dialogRef = this.dialog.open(PopingListComponent, {
      data: {data:whoComments}
    })
  }

  openShares(sharing: any) {
    let whoShares:any[] = [];
    sharing.forEach((share: any) => {
      employeeDataStore.forEach((emp) => {
        if (emp.id == share) {
          whoShares.push(emp);
        }
      })
    })
    const dialogRef = this.dialog.open(PopingListComponent, {
      data: {data:whoShares}
    })
  }

  navigateUrl(id:any) {
    this.router.navigate([`/profile/${id}/about/${id}`]);
  }
}
