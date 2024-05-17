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
import {AuthService} from "../../../services/auth.service";

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
    'https://img.freepik.com/free-photo/snowy-mountain-peak-starry-galaxy-majesty-generative-ai_188544-9650.jpg?w=996&t=st=1715601166~exp=1715601766~hmac=a316e8d9fbf63dc7910796c350f5915131f56ae5607bbc60442c44f6dd2f78a3',
    'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?t=st=1715600602~exp=1715604202~hmac=449d5e626eeca272f7aa72388d107ea68f7233ed0b2a6eb6a95e859c885172ab&w=996',
    'https://img.freepik.com/free-photo/fresh-autumn-leaves-reveal-vibrant-organic-pattern-generated-by-ai_188544-15037.jpg?w=996&t=st=1715600804~exp=1715601404~hmac=1ffb437536f8d3e6d79fbbc01590b0ce03a19efd190e78071a5b7c60fd9aafc1',
    'https://img.freepik.com/free-photo/nature-beauty-reflected-tranquil-mountain-lake-generative-ai_188544-12625.jpg?w=996&t=st=1715600840~exp=1715601440~hmac=ce440a6738b8bed0902a786d19afe6c485c980e44724cbb839873928272f6185',
    'https://img.freepik.com/free-photo/natures-beauty-shines-multi-colored-floral-decoration-generative-ai_188544-8615.jpg?w=996&t=st=1715600880~exp=1715601480~hmac=12ef0258b73d13d36733188e46c2180b65a748c6cd2d3b434bef32e81685cc8b',
    'https://img.freepik.com/free-photo/beautiful-mountains-landscape_23-2150787838.jpg?t=st=1715600618~exp=1715604218~hmac=02f63ab77a901aa5e81b98dcbe8ae7946a8bc9525237d4f98bcdf18f1cd0a080&w=996',
    'https://img.freepik.com/free-photo/nature-landscape-with-black-sand-beach_23-2151380348.jpg?t=st=1715600195~exp=1715603795~hmac=249d869de3b141a801fbd6b73fedf625d4b09e922a0b165f3417f216688e2692&w=996',
    'https://img.freepik.com/free-photo/majestic-mountain-range-meets-reflective-blue-water-generated-by-ai_188544-15024.jpg?w=996&t=st=1715601030~exp=1715601630~hmac=02ac930005bc92a967bff449f55db2cf75ca1ad46fea7e2436473e61e3c9f52f',
    'https://img.freepik.com/free-photo/beautiful-mountains-landscape_23-2151151047.jpg?t=st=1715600988~exp=1715604588~hmac=e35346bae93cb1992ea07c46fdd0cc915c38e888ae64ea9b75bbce9e1f956d83&w=996',
  ];
  selectedCoverImage: string | undefined;

  constructor(
    private themeService: ThemeService,
    private employeeService: EmployeesService,
    private multimediaService:MultimediaService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: AuthService,
    private logger: NGXLogger) {
    this.themeSubscription = this.themeService.getThemeObservable().subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

  async ngOnInit(): Promise<any> {
    this.loggedUserId = this.cookieService.userID().toString();
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
