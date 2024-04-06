import {Component, OnInit} from '@angular/core';
import {ThemeService} from "../../../services/theme.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {MultimediaService} from "../../../services/multimedia.service";
import {NGXLogger} from "ngx-logger";
import {PopingListComponent} from "../feed/feed.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CommentsService} from "../../../services/comments.service";
import {EmployeesService} from "../../../services/employees.service";
import {Observable, tap} from "rxjs";
import {SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-feed-posts',
  templateUrl: './feed-posts.component.html',
  styleUrls: ['./feed-posts.component.scss']
})
export class FeedPostsComponent implements OnInit{
  employeesDataStore:any;
  multimediaDataStore:any;
  commentDataStore:any[]=[];
  employee: any = {
    photo:''
  };
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

  channelId:any[] = [];
  feed:any;

  userId:any;

  maxCommentsDisplayed: number = 2; // maximum number of comment displayed as normal
  showAllComments: boolean = false; // see more and see less handling boolean variable

  commentForm = new FormGroup({
    comment: new FormControl(null, [
        Validators.required,
        Validators.maxLength(300)
    ])
  })

  constructor(private themeService: ThemeService,
              private dialog: MatDialog,
              private router: Router,
              private multimediaService: MultimediaService,
              private employeesService: EmployeesService,
              private route: ActivatedRoute,
              private commentsService: CommentsService,
              private logger: NGXLogger) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadAllUsers().subscribe(()=>{
      this.getUser();
      this.loadMultimedia();
      this.loadComments();
      this.hideCommentSection();
      this.logger.log("fetched current user into the feed post component", this.employee)
      this.logger.log("filtered and loaded multimedia")
      this.logger.log("filtered and loaded comments")
    });
  }

  loadAllUsers(): Observable<any>{
    return this.employeesService.getAllEmployees().pipe(
        tap(data => this.employeesDataStore = data)
    );
  }

  loadMultimedia() {
    this.multimediaService.getAllMultimedia().subscribe(data=>{
      this.multimediaDataStore = data;
      this.loadFeed(this.multimediaDataStore)
    }, err =>{
      return console.log(err)
    })
  }

  loadComments(){
    this.commentsService.getAllComments().subscribe(data =>{
      this.commentDataStore = data
    }, error => {
      console.log(error)
    })
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
    if (this.employeesDataStore) { // Check if employeesDataStore is populated
      const foundEmployee = this.employeesDataStore.find((emp: any) => emp.id === this.userId);
      if (foundEmployee) {
        this.employee = foundEmployee;
        this.loadChannelIds();
      }
    }
  }

  convertToSafeUrl(url:any):SafeResourceUrl{
    return this.multimediaService.convertToSafeUrl(url,'image/jpeg')
  }

  loadChannelIds(){
    this.employee.channels.forEach((id:any)=>{
      this.channelId.push(id.id)
    })
  }

  loadFeed(data:any) {
    if (this.router.url == '/feed/area') {
      this.feed = data.filter((feed: any) => this.channelId.includes(feed.channelId)); // handle multiple channels
    }
    else{
      const id = this.router.url.split('/')[2];
      this.feed = data.filter((feed:any) => (feed.userId == id) ? this.feed = [feed] : null )
    }

    this.feed.forEach((feed:any) => {
      this.employeesDataStore.forEach((emp:any) => {
        if (emp.id == feed.userId) {
          this.feedPost.push({
            id: feed.id,
            user: emp.name,
            userId: emp.id,
            userPosition: emp.jobData.position,
            userPhoto: this.multimediaService.convertToSafeUrl(emp.photo, 'image/jpeg'),
            time: feed.timestamp,
            message: feed.title,
            file: this.multimediaService.convertToSafeUrl(feed.file.data, feed.contentType),
            type: feed.contentType,
            likes: feed.likes?.length,
            likers: feed.likes,
            comments: feed.comments?.length,
            commenters: feed.comments,
            shares: feed.shares?.length,
            sharing: feed.shares
          })
        }
      })
    })

    this.feedPost = this.feedPost.filter(time => (time.time != '') ? this.commentSection = true : false )
  }

  commentsForPost(id: any): any[] {
    const filteredComments = this.commentDataStore.filter((comment:any) => comment.multimediaId == id);

    this.comments = filteredComments.map((comment:any) => {
      const user = this.employeesDataStore.find((emp:any) => emp.id.toString() === comment.userId);

      return {
        id: comment.id,
        user: user ? user.name : '',
        userId: user ? user.id : '',
        userProfile: user ? this.multimediaService.convertToSafeUrl(user.photo, 'image/jpeg') : '',
        comment: comment.comment,
        time: comment.timestamp,
      };
    });

    return this.comments.sort((a: any, b: any) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime(); // Reversed comparison logic
    });
  }

  openLikes(likers: any) {
    let whoLikes:any[] = [];
    likers.forEach((liker: any) => {
      this.employeesDataStore.forEach((emp:any) => {
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
      this.employeesDataStore.forEach((emp:any) => {
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
      this.employeesDataStore.forEach((emp:any) => {
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

  addComment(postId: any) {
    if(this.commentForm.valid){
      this.commentsService.saveComment({
        userId: this.userId,
        multimediaId: postId,
        comment: this.commentForm.value.comment,
        timestamp: new Date()
      }).subscribe((data)=>{
        this.loadComments()
        this.commentForm.reset();
      }, err =>{
        console.log(err)
      })
    }
  }

  toggleComments() {
    this.showAllComments = !this.showAllComments;
    if (this.showAllComments) {
      this.maxCommentsDisplayed = Infinity; // Show all comments
    } else {
      this.maxCommentsDisplayed = 2; // Show limited number of comments
    }
  }
}
