import {Component, Inject, OnInit} from '@angular/core';
import {employeeDataStore} from "../../data-stores/employee-data-store";
import {multimediaDataStore} from "../../data-stores/multimedia-data-store";
import {commentDataStore} from "../../data-stores/comment-data-store";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {NgClass, NgFor, NgForOf, NgIf} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {Subscription} from "rxjs";
import {ThemeService} from "../../../services/theme.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";

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
      userId: '',
      userPosition: '',
      userPhoto: '',
      time: '',
      message: '',
      file: '',
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

  userId:string = "3";

  constructor(private themeService: ThemeService, private dialog: MatDialog, private router: Router, private route: ActivatedRoute, private logger: NGXLogger) {
  }

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
            userId: emp.id,
            userPosition: emp.jobData.position,
            userPhoto: emp.photo,
            time: feed.timestamp,
            message: feed.title,
            file: feed.file,
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


@Component({
  selector: 'app-post-video',
  templateUrl: '../poping-list/poping-list.component.html',
  styleUrls: ['../poping-list/poping-list.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, NgClass, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, NgFor, NgIf, NgForOf],
})
export class PopingListComponent {
  private themeSubscription: Subscription;
  isDarkMode: boolean | undefined;


  constructor(private themeService: ThemeService, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: {data: any[]}) {
    this.themeSubscription = this.themeService.getThemeObservable().subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }
}
