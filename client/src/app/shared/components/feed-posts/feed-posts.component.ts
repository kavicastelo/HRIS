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
import {forkJoin, map, mergeMap, Observable, tap} from "rxjs";
import {SafeResourceUrl} from "@angular/platform-browser";
import {LikesService} from "../../../services/likes.service";

@Component({
  selector: 'app-feed-posts',
  templateUrl: './feed-posts.component.html',
  styleUrls: ['./feed-posts.component.scss']
})
export class FeedPostsComponent implements OnInit{
  employeesDataStore:any;
  multimediaDataStore:any;
  likedDataStore:any[]=[];
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
      isLiked: false
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
              private likesService: LikesService,
              private commentsService: CommentsService,
              private logger: NGXLogger) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadAllUsers().subscribe(()=>{
      this.getUser();
      this.loadMultimedia();
      this.loadComments();
      this.hideCommentSection();
      this.loadLikes();
    });
    await this.loadLikes().subscribe(()=>{
      // this.checkLikesWithUser();
    })
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

  loadLikes(): Observable<any>{
    return this.likesService.getAllLikes().pipe(
        tap(data => this.likedDataStore = data)
    );
  }

  hideCommentSection() {
    this.route.paramMap.subscribe(params => {
      if(params.get('id')) {
        this.commentSection = false;
      }
    })
  }

  async checkLikesWithUser(feedPost:any){
    feedPost.forEach((post:any) => {
      this.likedDataStore.forEach((like:any) => {
        if (post.id == like.multimediaId && like.userId == this.userId){
          post.isLiked = true;
        }
      })
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

  async loadFeed(data:any) {
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
          if(feed.file != null) {
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
              sharing: feed.shares,
              isLiked: false,
            })
          }
          else {
            this.feedPost.push({
              id: feed.id,
              user: emp.name,
              userId: emp.id,
              userPosition: emp.jobData.position,
              userPhoto: this.multimediaService.convertToSafeUrl(emp.photo, 'image/jpeg'),
              time: feed.timestamp,
              message: feed.title,
              likes: feed.likes?.length,
              likers: feed.likes,
              comments: feed.comments?.length,
              commenters: feed.comments,
              shares: feed.shares?.length,
              sharing: feed.shares,
              isLiked: false
            })
          }
        }
      })
    })

    this.checkLikesWithUser(this.feedPost)

    this.feedPost = this.feedPost.filter(time => (time.time != '') ? this.commentSection = true : false )
    this.feedPost.sort((a: any, b: any) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime(); // Reversed comparison logic
    })
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

  async likePost(postId: any) {
    // Toggle the like status locally
    const likedPostIndex = this.feedPost.findIndex(post => post.id === postId);
    if (likedPostIndex !== -1 || likedPostIndex !== null) {
      const likedPost = this.feedPost[likedPostIndex];
      likedPost.isLiked = !likedPost.isLiked;
      likedPost.likes += likedPost.isLiked ? 1 : -1;
      // Update the local data store
      this.feedPost[likedPostIndex] = likedPost;
    }

    // Make the API call to update the likes
    this.likesService.toggleLike({
      id: postId + this.userId,
      userId: this.userId,
      multimediaId: postId,
      timestamp: new Date()
    }).subscribe((data) => {
      this.logger.info(data);
      // TODO: add error handlers
    }, error => {
      this.logger.error(error);
      // Roll back the local changes if the API call fails
      if (likedPostIndex !== -1) {
        const likedPost = this.feedPost[likedPostIndex];
        likedPost.isLiked = !likedPost.isLiked;
        likedPost.likes += likedPost.isLiked ? 1 : -1;
        // Update the local data store
        this.feedPost[likedPostIndex] = likedPost;
      }
    });
  }

  openLikes(likers: any) {
    let whoLikes:any[] = [];
    let filteredLikes:any[] = [];

    likers.forEach((liker: any) => {
      this.likedDataStore.forEach((likes:any) => {

        [likes].forEach((like:any) => {
          if (like.id == liker){
            filteredLikes.push(like);
          }
        })
      })
      this.employeesDataStore.forEach((emp:any) => {
        filteredLikes.forEach(fl => {
          if (emp.id == fl.userId){
            whoLikes.push(emp);
          }
        })
      })
    })

    // Collect all observables for fetching likes
    const likeObservables = likers.map((liker: any) => {
      return this.likesService.getAllLikes().pipe(
          map(likes => likes.filter((like: any) => like.id == liker)),
          mergeMap(filteredLikes =>
              this.employeesDataStore.filter((emp: any) => filteredLikes.some((fl: any) => emp.id == fl.userId))
          )
      );
    });

    // Wait for all observables to complete
    forkJoin(likeObservables).subscribe((results:any) => {
      // Flatten the results array
      whoLikes = results.flat();

      // Remove duplicates
      whoLikes = this.removeDuplicates(whoLikes, 'id');

      // Open the dialog with filtered likes
      const dialogRef = this.dialog.open(PopingListComponent, {
        data: { data: whoLikes }
      });
    });
  }

  openComments(commenters: any) {
    let whoComments:any[] = [];
    let filteredComments:any[] = [];

    commenters.forEach((commenter: any) => {
      this.commentsService.getAllComments().subscribe(comments=>{
        comments.forEach((comment:any) =>{
          if (comment.id == commenter){
            filteredComments.push(comment)
          }
        })
        this.employeesDataStore.forEach((emp:any) => {
          filteredComments.forEach(fc => {
            if (emp.id == fc.userId) {
              whoComments.push(emp);
            }
          })
        })
      })
    })

    // Collect all observables for fetching comments
    const commentObservables = commenters.map((commenter: any) => {
      return this.commentsService.getAllComments().pipe(
          map(comments => comments.filter((comment: any) => comment.id == commenter)),
          mergeMap(filteredComments =>
              this.employeesDataStore.filter((emp: any) => filteredComments.some((fc: any) => emp.id == fc.userId))
          )
      );
    });

    // Wait for all observables to complete
    forkJoin(commentObservables).subscribe((results:any) => {
      // Flatten the results array
      whoComments = results.flat();

      // Remove duplicates
      whoComments = this.removeDuplicates(whoComments, 'id');

      // Open the dialog with filtered comments
      const dialogRef = this.dialog.open(PopingListComponent, {
        data: { data: whoComments }
      });
    });
  }

  // Function to remove duplicates from array of objects
  removeDuplicates(array: any[], key: string): any[] {
    const seen = new Set();
    return array.filter((item) => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
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
