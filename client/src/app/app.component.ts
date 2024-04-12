import {Component, HostListener, OnInit} from '@angular/core';
import {ThemeService} from "./services/theme.service";
import {WebSocketService} from "./services/web-socket.service";
import {MultimediaService} from "./services/multimedia.service";
import {EmployeesService} from "./services/employees.service";
import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";
import {notificationsDataStore} from "./shared/data-stores/notifications-data-store";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';
  employeeDataStore:any;
  employee: any;
  userId:any;

  showAllNotifications: boolean = false;
  maxNotificationsDisplayed: number = 5;

  notifyDataStore: any = notificationsDataStore
  notifications:any[] = []

  constructor(public themeService: ThemeService,
              private webSocketService: WebSocketService,
              public multimediaService: MultimediaService,
              public router: Router,
              private employeeService: EmployeesService, private logger: NGXLogger) {

  }

  ngOnInit(): void {
    this.loadAllUsers();
    localStorage.setItem('sender','66105b9c22d9fd0f2042909e')
    this.userId = localStorage.getItem('sender')

    // Establish WebSocket connection
    this.webSocketService.connect('ws://localhost:4200/ws');

    this.webSocketService.getConnectionStatus().subscribe((status: boolean) => {
      this.logger.log('WebSocket connection status:', status);
    }, (error: any) => {
      this.logger.error('WebSocket connection error:', error);
    });

    this.updateLastSeen();
    this.loadAllNotifications();

    setInterval(()=> {
      this.loadAllNotifications();
      console.log(this.notifications)
    },1000*60*2)
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    // Update last seen status before closing the application
    this.updateLastSeen();
  }

  updateLastSeen() {
    const timestamp = new Date().toISOString();
    sessionStorage.setItem('lastSeen', timestamp);

    // Update last seen status on the server
    const userId = this.userId;
    this.employeeService.setActivityStatus(userId, timestamp).subscribe(
        (data: any) => {
          // TODO: do something
          // console.log(data);
        },
        (error) => {
          console.error(error);
        }
    );
  }

  loadAllUsers() {
    this.employeeService.getAllEmployees().subscribe(data =>{
      this.employeeDataStore = data;
      this.getUser(this.employeeDataStore);

      // convert base64 images to safe urls
      this.employeeDataStore.forEach((emp:any) => {
        emp.photo = this.multimediaService.convertToSafeUrl(emp.photo, 'image/jpeg');
      })

    }, error => {
      this.logger.error(error);
    })
  }

  getUser(data:any) {
    data.forEach((emp:any) => {
      if (emp.id == this.userId) {
        this.employee = [emp];
      }
    })
  }

  loadAllNotifications(){
    this.notifications = this.notifyDataStore.filter((notification:any) => notification.userId == this.userId)
    this.notifications.sort((a:any, b:any) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })
  }

  navigateUrl(location:any) {
    this.router.navigate([`/profile/${this.userId}/${location}/${this.userId}`]);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleNotifications() {
    this.showAllNotifications = !this.showAllNotifications;
    if (this.showAllNotifications) {
      this.maxNotificationsDisplayed = Infinity; // Show all notifications
    } else {
      this.maxNotificationsDisplayed = 5; // Show limited number of notifications
    }
  }
}
