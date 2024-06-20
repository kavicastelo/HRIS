import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OnboardinService} from "../../services/onboardin.service";
import {EmployeesService} from "../../services/employees.service";
import {forkJoin, Observable, Subscription, tap} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {ThemeService} from "../../services/theme.service";
import {MultimediaService} from "../../services/multimedia.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-onboarding-handle',
  templateUrl: './onboarding-handle.component.html',
  styleUrls: ['./onboarding-handle.component.scss']
})
export class OnboardingHandleComponent implements OnInit{
  loggedUserId: any;

  private themeSubscription: Subscription;
  isDarkMode: boolean | undefined;

  employeeDataStore:any;
  employee: any

  constructor(
      private themeService: ThemeService,
      private dialog: MatDialog,
      private router: Router,
      private cookieService: AuthService) {
    this.themeSubscription = this.themeService.getThemeObservable().subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loggedUserId = this.cookieService.userID().toString();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Logic to update active class based on the current route
        this.updateActiveClass();
      }
    });
  }

  navigateBetweenTabs(path: string) {
    this.router.navigate([`/onboardin/${path}/`]);
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
    return this.router.url === `/onboardin/${path}`;
  }
}
