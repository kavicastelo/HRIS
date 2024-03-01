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

const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'feed', component: FeedWrapperComponent,children: [
    { path: '', redirectTo: '/feed/area', pathMatch: 'full' },
    { path: 'area', component: FeedComponent }
  ]},
  { path: 'chat-list', component: ChatListComponent },
  { path: 'news', component: AnnouncementAreaComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LogInComponent},
  { path: '**', component:NotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
