import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ThemeService} from "../../services/theme.service";
import {MultimediaService} from "../../services/multimedia.service";
import {MatDialog} from "@angular/material/dialog";
import {NavigationEnd, Router} from "@angular/router";
import {SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.scss']
})
export class RecruitmentComponent implements OnInit{

  userId: any;
  loggedUserId: any;

  private themeSubscription: Subscription;
  isDarkMode: boolean | undefined;

  employeeDataStore:any;
  employee: any

  constructor(
    private themeService: ThemeService,
    private multimediaService:MultimediaService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.themeSubscription = this.themeService.getThemeObservable().subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Logic to update active class based on the current route
        this.updateActiveClass();
      }
    });
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
    return this.router.url === `/recruitment/${path}`;
  }

  navigateBetweenTabs(tab: string) {
    this.router.navigate([`/recruitment/${tab}/`]);
  }

  convertToSafeUrl(url:any): SafeResourceUrl{
    return this.multimediaService.convertToSafeUrl(url,'image/jpeg')
  }

}
