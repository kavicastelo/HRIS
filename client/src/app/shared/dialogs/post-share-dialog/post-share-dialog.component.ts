import {Component, Inject, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ThemeService} from "../../../services/theme.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MultimediaService} from "../../../services/multimedia.service";
import {SharesService} from "../../../services/shares.service";
import {ActivitiesService} from "../../../services/activities.service";
import {NotificationsService} from "../../../services/notifications.service";

@Component({
  selector: 'app-post-share-dialog',
  templateUrl: './post-share-dialog.component.html',
  styleUrls: ['./post-share-dialog.component.scss']
})
export class PostShareDialogComponent implements OnInit{

  private themeSubscription: Subscription;
  isDarkMode: boolean | undefined;

  receivedData: any;

  sharePostForm = new FormGroup({
    caption: new FormControl('', [
        Validators.maxLength(200)
    ])
  })

  constructor(private themeService: ThemeService,
              private multimediaService: MultimediaService,
              private activitiesService: ActivitiesService,
              private shareService: SharesService,
              private notificationsService: NotificationsService,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.themeSubscription = this.themeService.getThemeObservable().subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }

  ngOnInit() {
    this.receivedData = this.data;
  }

  sharePost(){
    this.shareService.saveShare({
      userId:this.receivedData.data.userId,
      multimediaId:this.receivedData.data.multimediaId,
      timestamp:new Date()
    }).subscribe((data: any) => {
      this.saveMultimedia();

      const postData = {
        postId:this.receivedData.data.multimediaId,
        posterName:this.receivedData.data.posterName,
        postCaption:this.receivedData.data.title,
        action:'Shared',
      }
      this.addActivities(postData);

      const notificationData = {
        userId: this.receivedData.data.userId,
        notification: this.receivedData.data.user + ' shared your post',
        timestamp: new Date(),
        router: '/feed/post/'+this.receivedData.data.multimediaId,
        status: true
      }

      this.pushNotification(notificationData);
    }, error => {
      console.log(error)
    })
  }

  saveMultimedia() {
    // Extract base64 content from SafeValue
    const safeValue = this.receivedData.data.file.toString();

    // Use regular expression to extract base64 content and detect whether it's an image or a video
    const matchesImage = safeValue.match(/data:image\/(jpeg|png|gif);base64,([^"]*)/);
    const matchesVideo = safeValue.match(/data:video\/\w+;base64,([^"]*)/);

    if (matchesImage && matchesImage.length > 2) {
      // Image detected
      const base64Content = matchesImage[2];
      const fileType = matchesImage[1];

      this.saveImage(base64Content, fileType);
    } else if (matchesVideo && matchesVideo.length > 1) {
      // Video detected
      const base64Content = matchesVideo[1];

      this.saveVideo(base64Content);
    } else {
      const metaData: any = {
        userId:this.receivedData.data.userId,
        channelId:this.receivedData.data.channelId,
        title: this.receivedData.data.title,
        timestamp:this.receivedData.data.timestamp,
        sharedUserId:this.receivedData.data.sharedUserId,
        sharedUserCaption:this.sharePostForm.value.caption,
        sharedUserTimestamp:new Date()
      }

      this.multimediaService.addMultimediaTextPost(metaData)
          .subscribe(() => {
            this.closePopup();
            // TODO: do something
          }, (error) => {
            // TODO: Handle error
          });
    }
  }

  private saveImage(base64Content: string, fileType: string) {
    // Decode the base64 string
    const decodedString = atob(base64Content.split(' ')[0]);

    // Convert the decoded string to Uint8Array
    const uint8Array = new Uint8Array(decodedString.length);
    for (let i = 0; i < decodedString.length; ++i) {
      uint8Array[i] = decodedString.charCodeAt(i);
    }

    // Create a Blob from Uint8Array
    const blob = new Blob([uint8Array], { type: `image/${fileType}` });

    // Create a File object from the Blob
    const file = new File([blob], `shared.${fileType}`);

    // Perform further operations with the image file...
    if (file) {
      this.multimediaService.addMultimediaPhoto(this.receivedData.data.title, file).subscribe((d) => {
        this.saveMultimediaMeta(d.id);
        this.closePopup();
      }, error => {
        console.log(error);
      });
    }
  }

  private saveVideo(base64Content: string) {
    // Decode the base64 string
    const decodedString = atob(base64Content.split(' ')[0]);

    // Convert the decoded string to Uint8Array
    const uint8Array = new Uint8Array(decodedString.length);
    for (let i = 0; i < decodedString.length; ++i) {
      uint8Array[i] = decodedString.charCodeAt(i);
    }

    // Create a Blob from Uint8Array
    const blob = new Blob([uint8Array], { type: 'video/mp4' });

    // Create a File object from the Blob
    const file = new File([blob], 'shared.mp4');

    // Perform further operations with the video file...
    if (file) {
      this.multimediaService.addMultimediaVideo(this.receivedData.data.title, file).subscribe((d) => {
        this.saveMultimediaMeta(d.id);
        this.closePopup();
      }, error => {
        console.log(error);
      });
    }
  }

  saveMultimediaMeta(id: any){
    const metaData: any = {
      id: id,
      userId:this.receivedData.data.userId,
      channelId:this.receivedData.data.channelId,
      timestamp:this.receivedData.data.timestamp,
      contentType:this.receivedData.data.contentType,
      sharedUserId:this.receivedData.data.sharedUserId,
      sharedUserCaption:this.sharePostForm.value.caption,
      sharedUserTimestamp:new Date()
    }

    this.multimediaService.addMultimediaMeta(metaData).subscribe((data: any) => {
      // TODO: do something when success
    }, error => {
      console.log(error)
    })
  }

  // Function to convert data URI to Blob
  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer]);
  }

  addActivities(data:any){
    this.activitiesService.addActivity({
      userId:this.receivedData.data.sharedUserId,
      userName:this.receivedData.data.user,
      postId:data.postId,
      posterName:data.posterName,
      postCaption:data.postCaption,
      action:data.action,
      timestamp:new Date()
    }).subscribe( data => {
      // TODO: do something
    }, error => {
      // TODO: do something
    })
  }

  pushNotification(data:any){
    if (data){
      this.notificationsService.saveNotification(data).subscribe(data=>{
        console.log(data)
      }, error => {
        console.log(error)
      })
    }
  }

  closePopup(){
    this.dialog.closeAll();
  }
}
