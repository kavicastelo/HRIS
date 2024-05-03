import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {NotFoundComponent} from "./shared/components/not-found/not-found.component";
import {ProfileComponent} from "./shared/components/profile/profile.component";
import {FeedWrapperComponent} from "./components/feed-wrapper/feed-wrapper.component";
import {FeedComponent} from "./shared/components/feed/feed.component";
import {LogInComponent} from './components/login/login.component';
import {ChatListComponent} from "./shared/components/chat-list/chat-list.component";
import {AnnouncementAreaComponent} from "./shared/components/announcement-area/announcement-area.component";
import {ProfileAboutComponent} from "./shared/components/profile/profile-about/profile-about.component";
import {ProfilePostsComponent} from "./shared/components/profile/profile-posts/profile-posts.component";
import {ProfileActivityComponent} from "./shared/components/profile/profile-activity/profile-activity.component";
import {EmployeeRegisterComponent} from "./shared/components/employee-register/employee-register.component";
import {ResetPasswordComponent} from "./components/reset-password/reset-password.component";
import {EditProfileComponent} from "./shared/components/profile/edit-profile/edit-profile.component";
import {ChatAreaComponent} from "./shared/components/chat-area/chat-area.component";
import {PostComponent} from "./shared/components/post/post.component";
import {RequestsComponent} from "./components/requests/requests.component";
import {TransferRequestComponent} from "./components/requests/transfer-request/transfer-request.component";
import {PromotionRequestComponent} from "./components/requests/promotion-request/promotion-request.component";
import {AuthGuard} from "./guards/auth.guard";
import {EmployeeComponent} from "./components/employee/employee.component";
import {EmpDashboardComponent} from "./components/employee/emp-dashboard/emp-dashboard.component";
import {EmpTransferComponent} from "./components/employee/emp-transfer/emp-transfer.component";
import {EmpPromotionComponent} from "./components/employee/emp-promotion/emp-promotion.component";
import {BulletinsComponent} from "./components/bulletins/bulletins.component";
import {PayrollComponent} from "./components/payroll/payroll.component";
import {AddpayiteamsComponent} from './components/payroll/addpayiteams/addpayiteams.component';
import {EmployeeUpdateComponent} from "./shared/components/employee-update/employee-update.component";
import {OnboardingHandleComponent} from "./components/onboarding-handle/onboarding-handle.component";
import {AmLmComponent} from "./components/am-lm/am-lm.component";
import {AttendenceComponent} from "./components/am-lm/attendence/attendence.component";
import {LeaveComponent} from "./components/am-lm/leave/leave.component";
import {LeaveRequestComponent} from "./components/requests/leave-request/leave-request.component";
import { EmployeePaymentsComponent } from './components/payroll/employee-payments/employee-payments/employee-payments.component';
import { ViewEmployeePayitemsComponent } from './components/payroll/view-employee-payitems/view-employee-payitems/view-employee-payitems.component';
import { PayitemsComponent } from './components/payroll/payitems/payitems/payitems.component';
import { AssignPayitemComponent } from './components/payroll/assign-payitem/assign-payitem/assign-payitem.component';


const routes: Routes = [
    {path: '', redirectTo: 'feed', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {
        path: 'feed', component: FeedWrapperComponent, canActivate: [AuthGuard], children: [
            {path: '', redirectTo: '/feed/area', pathMatch: 'full'},
            {path: 'area', component: FeedComponent},
            {path: 'post/:postId', component: PostComponent},
            {path: 'chat/:id', component: ChatAreaComponent},
        ]
    },
    {path: 'chat-list', component: ChatListComponent, canActivate: [AuthGuard]},
    {path: 'news', component: AnnouncementAreaComponent, canActivate: [AuthGuard]},
    {
        path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard], children: [
            {path: '', redirectTo: '/profile/:id/about/:id', pathMatch: 'full'},
            {path: 'about/:id', component: ProfileAboutComponent},
            {path: 'edit/:id', component: EditProfileComponent},
            {path: 'posts/:id', component: ProfilePostsComponent},
            {path: 'activity/:id', component: ProfileActivityComponent},
        ]
    },
    {path: 'login', component: LogInComponent},
    {path: 'emp-register', component: EmployeeRegisterComponent, canActivate: [AuthGuard]},
    {path: 'emp-update/:id', component: EmployeeUpdateComponent, canActivate: [AuthGuard]},
    {path: 'bulletins', component: BulletinsComponent, canActivate: [AuthGuard]},
    {path: 'reset-password', component: ResetPasswordComponent},
    {
        path: 'requests/:id', component: RequestsComponent, canActivate: [AuthGuard], children: [
            {path: '', redirectTo: '/requests/:id/transfer/:id', pathMatch: 'full'},
            {path: 'transfer/:id', component: TransferRequestComponent},
            {path: 'promotion/:id', component: PromotionRequestComponent},
            {path: 'leave/:id', component: LeaveRequestComponent},
        ]
    },
    {
        path: 'employee', component: EmployeeComponent, canActivate: [AuthGuard], children: [
            {path: '', redirectTo: '/employee/dashboard', pathMatch: 'full'},
            {path: 'dashboard', component: EmpDashboardComponent},
            {path: 'transfer', component: EmpTransferComponent},
            {path: 'promotion', component: EmpPromotionComponent},
        ]
    },
    {
        path: 'alm', component:AmLmComponent, canActivate: [AuthGuard], children: [
            {path: '', redirectTo: '/alm/attendance', pathMatch: 'full'},
            {path: 'attendance', component: AttendenceComponent},
            {path: 'leave', component: LeaveComponent}
        ]
    },
    {
        path: 'payroll', component:PayrollComponent, canActivate: [AuthGuard], children: [
            {path: '', redirectTo: '/payroll/employee-payments', pathMatch: 'full'},
            {path: 'employee-payments', component: EmployeePaymentsComponent},
            {path: 'employee/:id/payitems', component: ViewEmployeePayitemsComponent},
            {path:'payitems', component: PayitemsComponent},
            {path:'new-payitem', component: AddpayiteamsComponent},
            {path:'assign-payitem', component: AssignPayitemComponent}
        ]
    },
    {path:'onboardin', component:OnboardingHandleComponent, canActivate: [AuthGuard]},
    {path: '**', component: NotFoundComponent},

];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
