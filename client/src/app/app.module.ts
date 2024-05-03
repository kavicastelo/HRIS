import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {NotFoundComponent} from './shared/components/not-found/not-found.component';
import {ProfileComponent} from './shared/components/profile/profile.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EmptyDialogComponent} from './shared/dialogs/empty-dialog/empty-dialog.component';
import {PostComponent} from './shared/components/post/post.component';
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
import {ProfileAboutComponent} from './shared/components/profile/profile-about/profile-about.component';
import {ProfileActivityComponent} from './shared/components/profile/profile-activity/profile-activity.component';
import {ProfilePostsComponent} from './shared/components/profile/profile-posts/profile-posts.component';
import {HttpClientModule} from "@angular/common/http";
import {EmployeeRegisterComponent} from './shared/components/employee-register/employee-register.component';
import {ResetPasswordComponent} from "./components/reset-password/reset-password.component";
import {EditProfileComponent} from './shared/components/profile/edit-profile/edit-profile.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {FeedPostsComponent} from './shared/components/feed-posts/feed-posts.component';
import {ChatAreaComponent} from './shared/components/chat-area/chat-area.component';
import {TimeAgoPipe} from "./DTO/TimeAgoPipe";
import {TruncatePipe} from "./DTO/TruncatePipe";
import {TruncateCommentsPipe} from "./DTO/TruncateCommentsPipe";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ConfirmDialogComponent} from './shared/dialogs/confirm-dialog/confirm-dialog.component';
import {PostingOptionsComponent} from './shared/dialogs/posting-options/posting-options.component';
import {MatSelectModule} from "@angular/material/select";
import {PostShareDialogComponent} from './shared/dialogs/post-share-dialog/post-share-dialog.component';
import {EditTextDialogComponent} from './shared/dialogs/edit-text-dialog/edit-text-dialog.component';
import {RequestsComponent} from './components/requests/requests.component';
import {TransferRequestComponent} from './components/requests/transfer-request/transfer-request.component';
import {PromotionRequestComponent} from './components/requests/promotion-request/promotion-request.component';
import {RequestTransferDialogComponent} from './shared/dialogs/request-transfer-dialog/request-transfer-dialog.component';
import {LetterDataDialogComponent} from './shared/dialogs/letter-data-dialog/letter-data-dialog.component';
import {RequestPromotionDialogComponent} from './shared/dialogs/request-promotion-dialog/request-promotion-dialog.component';
import {EmployeeComponent} from './components/employee/employee.component';
import {EmpDashboardComponent} from './components/employee/emp-dashboard/emp-dashboard.component';
import {EmpTransferComponent} from './components/employee/emp-transfer/emp-transfer.component';
import {EmpPromotionComponent} from './components/employee/emp-promotion/emp-promotion.component';
import {ChangeJobDataDialogComponent} from './shared/dialogs/change-job-data-dialog/change-job-data-dialog.component';
import {DateFormatPipe} from "./DTO/DateFormatPipe";
import {BulletinsComponent} from './components/bulletins/bulletins.component';
import {_MatSlideToggleRequiredValidatorModule, MatSlideToggleModule} from "@angular/material/slide-toggle";
import { PayrollComponent } from "./components/payroll/payroll.component";
import { AddpayiteamsComponent } from './components/payroll/addpayiteams/addpayiteams.component';
import { PayrollnavbarComponent } from './components/payroll/payrollnavbar/payrollnavbar.component';
import {EmployeeUpdateComponent} from './shared/components/employee-update/employee-update.component';
import { OnboardingHandleComponent } from './components/onboarding-handle/onboarding-handle.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {AmLmComponent} from './components/am-lm/am-lm.component';
import {AttendenceComponent} from './components/am-lm/attendence/attendence.component';
import {LeaveComponent} from './components/am-lm/leave/leave.component';
import {TimeFormatPipe} from "./DTO/TimeFormatPipe";
import {HourMinuteFormatPipe} from "./DTO/HourMinuteFormatPipe";
import {LeaveRequestComponent} from './components/requests/leave-request/leave-request.component';
import {RequestLeaveComponent} from './shared/dialogs/request-leave/request-leave.component';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        NotFoundComponent,
        ProfileComponent,
        EmptyDialogComponent,
        PostComponent,
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
        ChatAreaComponent,
        TimeAgoPipe,
        TruncatePipe,
        TimeFormatPipe,
        HourMinuteFormatPipe,
        TruncateCommentsPipe,
        DateFormatPipe,
        ConfirmDialogComponent,
        PostingOptionsComponent,
        PostShareDialogComponent,
        EditTextDialogComponent,
        RequestsComponent,
        TransferRequestComponent,
        PromotionRequestComponent,
        RequestTransferDialogComponent,
        LetterDataDialogComponent,
        RequestPromotionDialogComponent,
        EmployeeComponent,
        EmpDashboardComponent,
        EmpTransferComponent,
        EmpPromotionComponent,
        ChangeJobDataDialogComponent,
        BulletinsComponent,
        PayrollComponent,
        AddpayiteamsComponent,
        PayrollnavbarComponent,
        EmployeeUpdateComponent,
        OnboardingHandleComponent,
        AmLmComponent,
        AttendenceComponent,
        LeaveComponent,
        LeaveRequestComponent,
        RequestLeaveComponent

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
        MatNativeDateModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatSelectModule,
        MatSlideToggleModule,
        _MatSlideToggleRequiredValidatorModule,
        MatCheckboxModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
