import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {NgClass, NgFor, NgForOf, NgIf} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {Observable, Subscription, tap} from "rxjs";
import {ThemeService} from "../../../services/theme.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {MultimediaService} from "../../../services/multimedia.service";
import {EmployeesService} from "../../../services/employees.service";
import {SafeResourceUrl} from "@angular/platform-browser";

@Component({
    selector: 'app-feed',
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
    employeeDataStore: any;
    employee: any = {
        photo:''
    };

    commentSection: boolean = true;

    userId: any;

    constructor(private themeService: ThemeService,
                private dialog: MatDialog,
                private router: Router,
                private multimediaService: MultimediaService,
                private employeesService: EmployeesService,
                private route: ActivatedRoute,
                private logger: NGXLogger) {
    }

    async ngOnInit(): Promise<any> {
        this.loadAllUsers().subscribe(()=>{
            this.getUser();
            this.logger.log("all users are loaded to the feed")
            this.logger.log("current user fetched", this.employee)
        })
    }

    loadAllUsers(): Observable<any>{
        return this.employeesService.getAllEmployees().pipe(
            tap(data => this.employeeDataStore = data)
        );
    }

    getUser() {
        this.userId = localStorage.getItem('sender');
        return this.employee = this.employeeDataStore.find((emp: any) => emp.id === this.userId);
    }

    convertToSafeUrl(url:any):SafeResourceUrl{
        return this.multimediaService.convertToSafeUrl(url,'image/jpeg')
    }

    navigateUrl(id: any) {
        this.router.navigate([`/profile/${id}/about/${id}`]);
    }
}


@Component({
    selector: 'app-post-video',
    templateUrl: '../poping-list/poping-list.component.html',
    styleUrls: ['../poping-list/poping-list.component.scss'],
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, NgClass, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, NgFor, NgIf, NgForOf],
})
export class PopingListComponent {
    private themeSubscription: Subscription;
    isDarkMode: boolean | undefined;


    constructor(private themeService: ThemeService, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: { data: any[] }, public router: Router) {
        this.themeSubscription = this.themeService.getThemeObservable().subscribe((isDarkMode) => {
            this.isDarkMode = isDarkMode;
        });
    }

    navigateToProfile(id: any) {
        this.dialog.closeAll();
        this.router.navigate([`/profile/${id}/about/${id}`]);
    }
}
