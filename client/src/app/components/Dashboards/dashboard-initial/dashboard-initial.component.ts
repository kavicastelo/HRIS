import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, tap} from "rxjs";
import {SafeResourceUrl} from "@angular/platform-browser";
import {EmployeesService} from "../../../services/employees.service";
import {MultimediaService} from "../../../services/multimedia.service";
import {AuthService} from "../../../services/auth.service";
import {Chart, registerables} from "chart.js";
import _default from "chart.js/dist/plugins/plugin.legend";
import position = _default.defaults.position;
import {EventAddComponent} from "../../../shared/dialogs/event-add/event-add.component";
import {MatDialog} from "@angular/material/dialog";
import {EventService} from "../../../services/event.service";
import {OnboardinService} from "../../../services/onboardin.service";

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-initial',
  templateUrl: './dashboard-initial.component.html',
  styleUrls: ['./dashboard-initial.component.scss']
})
export class DashboardInitialComponent implements OnInit {

  userId: any;
  loggedUserId: any;
  organizationId: any;

  // test data for profile
  employeeDataStore: any;
  employee: any = {
    name: '',
    photo: ''
  }

  eventDataStore: any;
  quickAccessDataStore: any;

  taskDataStore: any[] = [];
  pendingTasks: any[] = [];
  completedTasks: any[] = [];

  isLoadingEvent: boolean = false;
  isFoundEvent: boolean = false;
  isLoadingPTask: boolean = false;
  isFoundPTask: boolean = false;
  isLoadingCTask: boolean = false;
  isFoundCTask: boolean = false;
  isLoadingQuickAccess: boolean = false;
  isFoundQuickAccess: boolean = false;

  constructor(
    private employeeService: EmployeesService,
    private eventService: EventService,
    private onboardingService: OnboardinService,
    private multimediaService: MultimediaService,
    private dialog: MatDialog,
    private cookieService: AuthService) {
  }

  async ngOnInit(): Promise<any> {
    this.loggedUserId = this.cookieService.userID().toString();
    this.organizationId = this.cookieService.organization().toString();

    await this.loadAllUsers().subscribe(() => {
      this.getUser();
    })

    await this.loadAllEvents().subscribe(() => {
      this.isLoadingEvent = false;
      if(this.eventDataStore.length > 0) {
        this.isFoundEvent = true;
      }
    })

    await this.loadAllTasks().subscribe(() => {
      this.isLoadingPTask = false;
      this.isLoadingCTask = false;

      this.filteredCompletedTasks();
      this.filteredPendingTasks();
    })
  }

  loadAllUsers(): Observable<any> {
    return this.employeeService.getAllEmployees().pipe(
      tap(data => this.employeeDataStore = data)
    );
  }

  getUser() {
    this.userId = this.cookieService.userID().toString();
    return this.employee = this.employeeDataStore.find((emp: any) => emp.id === this.userId);
  }

  loadAllEvents(): Observable<any> {
    this.isFoundEvent = false;
    this.isLoadingEvent = true;
    return this.eventService.getEvents().pipe(
      tap(data => this.eventDataStore = data)
    );
  }

  loadAllTasks(): Observable<any> {
    this.isFoundPTask = false;
    this.isLoadingPTask = true;
    this.isFoundCTask = false;
    this.isLoadingCTask = true;
    return this.onboardingService.getAllTasks().pipe(
      tap(data => this.taskDataStore = data)
    );
  }

  filteredCompletedTasks() {
    this.completedTasks = this.taskDataStore.filter((data:any)=> data.organizationId == this.organizationId);
    this.completedTasks = this.completedTasks.filter((data:any)=> data.status == 'Completed');

    if (this.completedTasks.length > 0) {
      this.isFoundCTask = true;
    }
    return this.completedTasks
  }

  filteredPendingTasks() {
    this.pendingTasks = this.taskDataStore.filter((data:any)=> data.organizationId == this.organizationId);
    this.pendingTasks = this.pendingTasks.filter((data:any)=> data.status == 'Pending Review');

    if (this.pendingTasks.length > 0) {
      this.isFoundPTask = true;
    }
    return this.pendingTasks
  }

  convertToSafeUrl(url: any): SafeResourceUrl {
    return this.multimediaService.convertToSafeUrl(url, 'image/jpeg')
  }

  openCreateDialog() {

    const dialogRef = this.dialog.open(EventAddComponent, {
      maxHeight: '90vh',
      data: {
        title: 'Add Event',
        event: null,
        userId: this.userId
      }
    });
  }
}
