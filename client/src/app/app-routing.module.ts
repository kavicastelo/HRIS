import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {NotFoundComponent} from "./shared/components/not-found/not-found.component";
import {ProfileComponent} from "./shared/components/profile/profile.component";
import {FeedWrapperComponent} from "./components/feed-wrapper/feed-wrapper.component";
import {FeedComponent} from "./shared/components/feed/feed.component";
import { LogInComponent } from './components/login/login.component';
import {ChatListComponent} from "./shared/components/chat-list/chat-list.component";
import {AnnouncementAreaComponent} from "./shared/components/announcement-area/announcement-area.component";
import {ProfileAboutComponent} from "./shared/components/profile/profile-about/profile-about.component";
import {ProfilePostsComponent} from "./shared/components/profile/profile-posts/profile-posts.component";
import {ProfileActivityComponent} from "./shared/components/profile/profile-activity/profile-activity.component";

const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'feed', component: FeedWrapperComponent,children: [
    { path: '', redirectTo: '/feed/area', pathMatch: 'full' },
    { path: 'area', component: FeedComponent }
  ]},
  { path: 'chat-list', component: ChatListComponent },
  { path: 'news', component: AnnouncementAreaComponent },
  { path: 'profile/:id', component: ProfileComponent, children: [
    { path: '', redirectTo: '/profile/:id/about/:id', pathMatch: 'full' },
    { path: 'about/:id', component: ProfileAboutComponent },
    { path: 'posts/:id', component: ProfilePostsComponent },
    { path: 'activity/:id', component: ProfileActivityComponent },
  ]},
  { path: 'login', component: LogInComponent},
  { path: '**', component:NotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
