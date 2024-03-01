import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostImageComponent } from './shared/components/post-image/post-image.component';
import { PostTextComponent } from './shared/components/post-text/post-text.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import { FeedWrapperComponent } from './components/feed-wrapper/feed-wrapper.component';
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import { FeedComponent } from './shared/components/feed/feed.component';
import { ChatListComponent } from './shared/components/chat-list/chat-list.component';
import { AnnouncementAreaComponent } from './shared/components/announcement-area/announcement-area.component';
import {MatExpansionModule} from "@angular/material/expansion";
import { LogInComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    ProfileComponent,
    PostImageComponent,
    PostTextComponent,
    FeedWrapperComponent,
    FeedComponent,
    ChatListComponent,
    AnnouncementAreaComponent,
    LogInComponent
    
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormsModule,
        MatIconModule,
        MatSidenavModule,
        MatExpansionModule
        
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
