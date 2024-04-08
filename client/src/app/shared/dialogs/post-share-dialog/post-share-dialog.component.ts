import {Component, Inject, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ThemeService} from "../../../services/theme.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MultimediaService} from "../../../services/multimedia.service";
import {SharesService} from "../../../services/shares.service";

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
              private shareService: SharesService,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.themeSubscription = this.themeService.getThemeObservable().subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }

  ngOnInit() {
    this.receivedData = this.data;
    console.log(this.receivedData.data.file)
  }

  sharePost(){
    this.shareService.saveShare({
      userId:this.receivedData.data.userId,
      multimediaId:this.receivedData.data.multimediaId,
      timestamp:new Date()
    }).subscribe((data: any) => {
      this.saveMultimedia();
    }, error => {
      console.log(error)
    })
  }

  saveMultimedia(){
    this.multimediaService.addMultimediaSharedPost({
      userId:this.receivedData.data.userId,
      channelId:this.receivedData.data.channelId,
      file:this.multimediaService.convertSafeUrlToBase64(this.receivedData.data.file),
      title:this.receivedData.data.title,
      timestamp:this.receivedData.data.timestamp,
      contentType:this.receivedData.data.contentType,
      sharedUserId:this.receivedData.data.sharedUserId,
      sharedUserCaption:this.sharePostForm.value.caption,
      sharedUserTimestamp:new Date()
    }).subscribe((data: any) => {
      // TODO: do something when success
    }, error => {
      console.log(error)
    })
  }

  closePopup(){
    this.dialog.closeAll();
  }
}
