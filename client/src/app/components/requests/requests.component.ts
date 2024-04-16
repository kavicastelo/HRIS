import { Component } from '@angular/core';
import {Observable, Subscription, tap} from "rxjs";
import {ThemeService} from "../../services/theme.service";
import {EmployeesService} from "../../services/employees.service";
import {MultimediaService} from "../../services/multimedia.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {SafeResourceUrl} from "@angular/platform-browser";
import {PostVideoComponent} from "../../shared/components/profile/profile.component";

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent {

  userId: any;
  loggedUserId: any;

  private themeSubscription: Subscription;
  isDarkMode: boolean | undefined;

  employeeDataStore:any;
  employee: any

  constructor(
      private themeService: ThemeService,
      private employeeService: EmployeesService,
      private multimediaService:MultimediaService,
      private dialog: MatDialog,
      private router: Router,
      private route: ActivatedRoute,
      private logger: NGXLogger) {
    this.themeSubscription = this.themeService.getThemeObservable().subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

  async ngOnInit(): Promise<any> {
    this.loggedUserId = localStorage.getItem('sender')

    await this.loadAllUsers().subscribe(()=>{
      this.getUser();
    })

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Logic to update active class based on the current route
        this.updateActiveClass();
      }
    });
  }

  loadAllUsers(): Observable<any>{
    return this.employeeService.getAllEmployees().pipe(
        tap(data => this.employeeDataStore = data)
    );
  }

  getUser() {
    this.employeeDataStore.forEach((emp:any) => {
      this.route.paramMap.subscribe(params => {
        this.userId = params.get('id');

        if (emp.id == this.userId) {
          this.employee = [emp];
        }
      })
    })
  }

  convertToSafeUrl(url:any):SafeResourceUrl{
    return this.multimediaService.convertToSafeUrl(url,'image/jpeg')
  }

  navigateBetweenTabs(path: string) {
    this.router.navigate([`/requests/${this.userId}/${path}/${this.userId}`]);
  }

  updateActiveClass() {
    const currentRoute = this.router.url;

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });

    const activeLink = document.querySelector(`.nav-link[href="${currentRoute}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
  isActive(path: string) {
    return this.router.url === `/requests/${this.userId}/${path}/${this.userId}`;
  }
}
