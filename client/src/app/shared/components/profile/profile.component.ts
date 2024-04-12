import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ThemeService} from "../../../services/theme.service";
import {Observable, Subscription, tap} from "rxjs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {NgClass, NgFor, NgIf} from "@angular/common";
import {MatSelectModule} from "@angular/material/select";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {EmployeesService} from "../../../services/employees.service";
import {SafeResourceUrl} from "@angular/platform-browser";
import {MultimediaService} from "../../../services/multimedia.service";

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  animal: string | undefined;
  name: string | undefined;

  userId: any;
  loggedUserId: any;

  private themeSubscription: Subscription;
  isDarkMode: boolean | undefined;

  // test data for profile
  employeeDataStore:any;
  employee: any

  coverImages: any[] = [
    'https://c1.wallpaperflare.com/preview/88/241/234/adult-blur-bokeh-city.jpg',
    'https://c1.wallpaperflare.com/preview/704/487/655/59687928ebb22-thumbnail.jpg',
    'https://e0.pxfuel.com/wallpapers/1017/992/desktop-wallpaper-rainy-night-background-for-your-mobile-tablet-explore-rainy-background-rainy-day-widescreen-rainy-day-dark-rainy-night.jpg',
    'https://e0.pxfuel.com/wallpapers/116/359/desktop-wallpaper-laptop-jason-choi-zy-23-rainy-london-thumbnail.jpg',
    'https://c4.wallpaperflare.com/wallpaper/564/101/189/autumn-forest-glade-wallpaper-preview.jpg',
    'https://wallpaper-house.com/data/out/12/wallpaper2you_513656.jpg',
    'https://c4.wallpaperflare.com/wallpaper/480/252/986/best-pictures-of-nature-hd-picture-1920x1080-wallpaper-preview.jpg',
    'https://wallpapercave.com/wp/wp8335968.jpg',
    'https://wallup.net/wp-content/uploads/2019/09/309505-forests-paths-golden-sunlight-morning-creek.jpg',
  ];
  selectedCoverImage: string | undefined;

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
    this.selectedCoverImage = this.randomCoverImage(); // choose random image and assigned it

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

  openVideoDialog() {
    const dialogRef = this.dialog.open(PostVideoComponent, {
      data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }

  randomCoverImage(): string {
    return this.coverImages[Math.floor(Math.random() * this.coverImages.length)];
  }

  navigateBetweenTabs(path: string) {
    this.router.navigate([`/profile/${this.userId}/${path}/${this.userId}`]);
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
    return this.router.url === `/profile/${this.userId}/${path}/${this.userId}`;
  }

  navigateChat() {
    this.router.navigate([`/feed/chat/${this.userId}`]);
  }

  logOut() {

  }
}

@Component({
  selector: 'app-post-video',
  templateUrl: '../post-video/post-video.component.html',
  styleUrls: ['../post-video/post-video.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, NgClass, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, NgFor, NgIf],
})
export class PostVideoComponent {
  private themeSubscription: Subscription;
  isDarkMode: boolean | undefined;

  constructor(private themeService: ThemeService, public dialog: MatDialog) {
    this.themeSubscription = this.themeService.getThemeObservable().subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }
}
