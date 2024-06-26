import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ShiftsService} from "../../../services/shifts.service";
import {AttendanceService} from "../../../services/attendance.service";
import {RecruitmentService} from "../../../services/recruitment.service";
import {Observable, tap} from "rxjs";
import {JobPostComponent} from "../../../shared/dialogs/job-post/job-post.component";

@Component({
  selector: 'app-recruitment-job-list',
  templateUrl: './recruitment-job-list.component.html',
  styleUrls: ['./recruitment-job-list.component.scss']
})
export class RecruitmentJobListComponent {

  userId: any
  organizationId: any
  jobsDataStore: any[] = [];
  filteredJobs: any[] = [];
  targetInput:any;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router,
              private cookieService: AuthService,
              private snackBar: MatSnackBar,
              private jobsService: RecruitmentService) {
  }

  async ngOnInit(): Promise<any> {
    this.userId = this.cookieService.userID().toString();
    this.organizationId = this.cookieService.organization().toString();

    await this.loadAllJobPosts().subscribe(()=>{
      this.filterJobPosts();
    })
  }

  loadAllJobPosts(): Observable<any>{
    return this.jobsService.getAllJobPosts().pipe(
      tap(data => this.jobsDataStore = data)
    );
  }

  filterJobPosts(): any[]{
    if (this.targetInput === undefined){
      this.filteredJobs = this.jobsDataStore.filter((data:any)=> data.organizationId == this.organizationId);
    }

    return this.filteredJobs;
  }

  handleSearch(data: any): void {
    this.targetInput = data as HTMLInputElement;
    const value = this.targetInput.value
    if (value) {
      this.filteredJobs = this.jobsDataStore.filter((data: any) =>
        data.organizationId === this.organizationId && data.name.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.filteredJobs = this.jobsDataStore.filter((data: any) => data.organizationId === this.organizationId);
    }
  }

  openSnackBar(message: any, action: any){
    this.snackBar.open(message, action, {duration:3000})
  }

  toggleDialog(title: any, msg: any, data: any, component: any) {
    const _popup = this.dialog.open(component, {
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        data: data,
        title: title,
        msg: msg
      }
    });
    _popup.afterClosed().subscribe(item => {

    })
  }

  createJobPost() {
    const data = {
      organizationId: this.organizationId
    }
    this.toggleDialog("Create Job Post", "", data, JobPostComponent)
  }
}
