import {Component, HostListener, OnInit} from '@angular/core';
import {ThemeService} from "./services/theme.service";
import {WebSocketService} from "./services/web-socket.service";
import {MultimediaService} from "./services/multimedia.service";
import {EmployeesService} from "./services/employees.service";
import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";
import {NotificationsService} from "./services/notifications.service";
import {Observable, tap} from "rxjs";
import {AuthService} from "./services/auth.service";
import {OrganizationService} from "./services/organization.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'HR System';
    employeeDataStore: any;
    employee: any[] = [];
    userId: any;
    organizationId:any
    organizationName:any

    organization:any

    showAllNotifications: boolean = false;
    maxNotificationsDisplayed: number = 5;

    notifyDataStore: any[] = [];
    notifications: any[] = [];

    isServerConfig: boolean = false;

    constructor(public themeService: ThemeService,
                private webSocketService: WebSocketService,
                public multimediaService: MultimediaService,
                public notificationsService: NotificationsService,
                private organizationService: OrganizationService,
                public router: Router,
                private cookieService: AuthService,
                private employeeService: EmployeesService, private logger: NGXLogger) {

    }

    async ngOnInit(): Promise<any> {
        this.loadAllUsers();
        this.userId = this.cookieService.userID().toString();
        this.organizationId = this.cookieService.organization().toString();

        await this.getOrganization().subscribe(()=>{
            this.organizationName = this.organization.organizationName + " HR System"
        });

        if (this.cookieService.isExists()) {
            // Establish WebSocket connection
            // this.webSocketService.connect('ws://localhost:3269/ws');
            //
            // this.webSocketService.getConnectionStatus().subscribe((status: boolean) => {
            //     this.logger.log('WebSocket connection status:', status);
            // }, (error: any) => {
            //     this.logger.error('WebSocket connection error:', error);
            // });

            this.updateLastSeen();
            await this.loadAllNotifications().subscribe(() => {
                this.loadFilteredNotifications();
            })

        } else {
            this.employee = [
                {
                    name: 'WELCOME',
                    jobData: {
                        position: 'USER PANEL',
                    },
                    photo: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg'
                }
            ]
        }

        setInterval(() => {
            this.loadFilteredNotifications();
        }, 1000 * 60 * 2)
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

    getOrganization(): Observable<any> {
        return this.organizationService.getOrganizationById(this.organizationId).pipe(
            tap(data => this.organization = data)
        );
    }

    loadAllUsers() {
        this.isServerConfig = true;
        this.employeeService.getAllEmployees().subscribe(data => {
            this.isServerConfig = false;
            this.employeeDataStore = data;
            this.getUser(this.employeeDataStore);

            // convert base64 images to safe urls
            this.employeeDataStore.forEach((emp: any) => {
                emp.photo = this.multimediaService.convertToSafeUrl(emp.photo, 'image/jpeg');
            })

        }, error => {
            this.logger.error(error);
        })
    }

    getUser(data: any) {
        data.forEach((emp: any) => {
            if (emp.id == this.userId) {
                this.employee = [emp];
            }
        })
    }

    loadAllNotifications(): Observable<any> {
        return this.notificationsService.getAllNotifications().pipe(
            tap(data => this.notifyDataStore = data)
        )
    }

    loadFilteredNotifications() {
        this.notifications = this.notifyDataStore.filter((notification: any) => notification.userId == this.userId)
        this.notifications.sort((a: any, b: any) => {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        })
    }

    navigateUrl(location: any) {
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

    readNotification(id: any) {
        this.notificationsService.updateStatus(id).subscribe(data => {
            this.loadAllNotifications().subscribe(() => {
                this.loadFilteredNotifications();
            });
        }, error => {
            this.logger.error(error)
        })
    }

    deleteNotification(id: any) {
        this.notificationsService.deleteNotification(id).subscribe(() => {
            this.loadAllNotifications().subscribe(() => {
                this.loadFilteredNotifications();
            });
        }, error => {
            this.logger.error(error)
        })
    }

    logOut() {
        this.cookieService.logout();
        this.router.navigate(['/login']).then(r => {
            location.reload();
        })
    }
}
