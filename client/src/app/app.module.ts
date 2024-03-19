import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {NotFoundComponent} from './shared/components/not-found/not-found.component';
import {ProfileComponent} from './shared/components/profile/profile.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PostImageComponent} from './shared/components/post-image/post-image.component';
import {PostTextComponent} from './shared/components/post-text/post-text.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FeedWrapperComponent} from './components/feed-wrapper/feed-wrapper.component';
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {FeedComponent} from './shared/components/feed/feed.component';
import {ChatListComponent} from './shared/components/chat-list/chat-list.component';
import {AnnouncementAreaComponent} from './shared/components/announcement-area/announcement-area.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {LogInComponent} from './components/login/login.component';
import {LoggerModule, NgxLoggerLevel} from "ngx-logger";
import { ProfileAboutComponent } from './shared/components/profile/profile-about/profile-about.component';
import { ProfileActivityComponent } from './shared/components/profile/profile-activity/profile-activity.component';
import { ProfilePostsComponent } from './shared/components/profile/profile-posts/profile-posts.component';
import {HttpClientModule} from "@angular/common/http";
import { EmployeeRegisterComponent } from './shared/components/employee-register/employee-register.component';
import {ResetPasswordComponent} from "./components/reset-password/reset-password.component";
import { EditProfileComponent } from './shared/components/profile/edit-profile/edit-profile.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { FeedPostsComponent } from './shared/components/feed-posts/feed-posts.component';
import { ChatAreaComponent } from './shared/components/chat-area/chat-area.component';

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
    LogInComponent,
    ProfileAboutComponent,
    ProfileActivityComponent,
    ProfilePostsComponent,
    EmployeeRegisterComponent,
    ResetPasswordComponent,
    EditProfileComponent,
    FeedPostsComponent,
    ChatAreaComponent
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
        MatExpansionModule,
        HttpClientModule,
        LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG}),
        ReactiveFormsModule,
        MatDatepickerModule,
      MatNativeDateModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
