import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {NotFoundComponent} from "./shared/components/not-found/not-found.component";
import {ProfileComponent} from "./shared/components/profile/profile.component";
import {FeedWrapperComponent} from "./components/feed-wrapper/feed-wrapper.component";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'feed', component: FeedWrapperComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', component:NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
