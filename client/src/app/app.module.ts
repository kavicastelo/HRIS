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
import {PayrollComponent} from "./components/payroll/payroll.component";
import {AddpayiteamsComponent} from './components/payroll/addpayiteams/addpayiteams.component';
import {PayrollnavbarComponent} from './components/payroll/payrollnavbar/payrollnavbar.component';
import {EmployeeUpdateComponent} from './shared/components/employee-update/employee-update.component';
import {OnboardingHandleComponent} from './components/onboarding-handle/onboarding-handle.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {AmLmComponent} from './components/am-lm/am-lm.component';
import {AttendenceComponent} from './components/am-lm/attendence/attendence.component';
import {LeaveComponent} from './components/am-lm/leave/leave.component';
import {TimeFormatPipe} from "./DTO/TimeFormatPipe";
import {HourMinuteFormatPipe} from "./DTO/HourMinuteFormatPipe";
import {LeaveRequestComponent} from './components/requests/leave-request/leave-request.component';
import {RequestLeaveComponent} from './shared/dialogs/request-leave/request-leave.component';
import {EmployeePaymentsComponent} from './components/payroll/employee-payments/employee-payments/employee-payments.component';
import {ViewEmployeePayitemsComponent} from './components/payroll/view-employee-payitems/view-employee-payitems/view-employee-payitems.component';
import {PayitemsComponent} from './components/payroll/payitems/payitems/payitems.component';
import {AssignPayitemComponent} from './components/payroll/assign-payitem/assign-payitem/assign-payitem.component';
import {ProfileAttendanceComponent} from './shared/components/profile/profile-attendance/profile-attendance.component';
import {AssignTaskComponent} from './components/onboarding-handle/assign-task/assign-task.component';
import {CreatePlanComponent} from './components/onboarding-handle/create-plan/create-plan.component';
import {CreateTaskComponent} from './components/onboarding-handle/create-task/create-task.component';
import { PayrollReportsComponent } from './components/payroll/payroll-reports/payroll-reports/payroll-reports.component';
import { MatTableModule } from '@angular/material/table';
import { ViewPayrollReportsComponent } from './components/payroll/payroll-reports/view-payroll-reports/view-payroll-reports.component';
import {PayrollReportsComponent} from './components/payroll/payroll-reports/payroll-reports/payroll-reports.component';
import {MatTableModule} from '@angular/material/table';
import {ViewPayrollReportsComponent} from './components/payroll/view-payroll-reports/view-payroll-reports/view-payroll-reports.component';
import {CreatePlanDialogComponent} from './shared/dialogs/create-plan-dialog/create-plan-dialog.component';
import {CreateTaskDialogComponent} from './shared/dialogs/create-task-dialog/create-task-dialog.component';
import {ShiftComponent} from './components/am-lm/shift/shift.component';
import {CreateShiftDialogComponent} from './shared/dialogs/create-shift-dialog/create-shift-dialog.component';
import { ViewPayrollReportDialogComponent } from './components/payroll/payroll-reports/view-payroll-report-dialog/view-payroll-report-dialog.component';
import { PayrollHistoryComponent } from './components/payroll/payroll-reports/payroll-history/payroll-history.component';
import {MarkAttendanceComponent} from './components/am-lm/mark-attendance/mark-attendance.component';
import {EditAttendanceComponent} from './shared/dialogs/edit-attendance/edit-attendance.component';
import {ApproveLeaveComponent} from './shared/dialogs/approve-leave/approve-leave.component';
import {CreateDepartmentDialogComponent} from './shared/dialogs/create-department-dialog/create-department-dialog.component';
import {MatMenuModule} from "@angular/material/menu";
import {ServerLoadingComponent} from './shared/effects/server-loading/server-loading.component';
import {InProgressComponent} from './shared/effects/in-progress/in-progress.component';
import {MarkdownModule} from "ngx-markdown";
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {PickerModule} from "@ctrl/ngx-emoji-mart";

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
        RequestLeaveComponent,
        EmployeePaymentsComponent,
        ViewEmployeePayitemsComponent,
        PayitemsComponent,
        AssignPayitemComponent,
        ProfileAttendanceComponent,
        ProfileAttendanceComponent,
        AssignTaskComponent,
        CreatePlanComponent,
        CreateTaskComponent,
        PayrollReportsComponent,
        ViewPayrollReportsComponent,
        CreatePlanDialogComponent,
        CreateTaskDialogComponent,
        ShiftComponent,
        CreateShiftDialogComponent,
        ViewPayrollReportDialogComponent,
        PayrollHistoryComponent
        MarkAttendanceComponent,
        EditAttendanceComponent,
        ApproveLeaveComponent,
        CreateDepartmentDialogComponent,
        ServerLoadingComponent,
        InProgressComponent
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
        MatCheckboxModule,
        MatTableModule,
        MatMenuModule,
        MarkdownModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireStorageModule,
        AngularFirestoreModule,
        AngularFireAuthModule,
        MatProgressBarModule,
        PickerModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
