import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {NgClass, NgFor, NgForOf, NgIf} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
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

    postForm = new FormGroup({
        caption: new FormControl(null, [
            Validators.required,
            Validators.maxLength(500)
        ])
    })
    chosenPhoto: File | undefined; // Store the chosen photo file
    chosenVideo: File | undefined; // Store the chosen video file

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

    choosePhoto(): void {
        // Trigger the file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg';
        input.onchange = (event: any) => {
            this.handleFileInput(event);
        };
        input.click();
    }

    chooseVideo(): void {
        // Trigger the file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/mp4';
        input.onchange = (event: any) => {
            this.handleVideoFileInput(event);
        };
        input.click();
    }

    handleFileInput(event: any): void {
        // Extract the chosen image file
        const files = event.target.files;
        if (files.length > 0) {
            this.chosenPhoto = files[0];
        }
    }

    handleVideoFileInput(event: any): void {
        // Extract the chosen video file
        const files = event.target.files;
        if (files.length > 0) {
            this.chosenVideo = files[0];
        }
    }

    async onSubmit(): Promise<void> {
        if (!this.chosenPhoto && !this.chosenVideo) {
            // TODO: Neither photo nor video is selected, handle this case
            return;
        }

        const caption: any = this.postForm.get('caption')?.value;

        if (this.chosenPhoto) {
            // Photo is selected
            this.multimediaService.addMultimediaPhoto(caption, this.chosenPhoto)
                .subscribe((response) => {
                    // Photo uploaded successfully
                    const id = response.id; // Assuming the response contains the ID of the uploaded multimedia
                    this.saveMetadata(id); // Save metadata
                }, (error) => {
                    // Handle error
                    this.logger.error('Error uploading photo:', error);
                });
        } else if (this.chosenVideo) {
            // Video is selected
            this.multimediaService.addMultimediaVideo(caption, this.chosenVideo)
                .subscribe((response) => {
                    // Video uploaded successfully
                    const id = response.id; // Assuming the response contains the ID of the uploaded multimedia
                    this.saveMetadata(id); // Save metadata
                }, (error) => {
                    // Handle error
                    this.logger.error('Error uploading video:', error);
                });
        } else if (this.chosenVideo && this.chosenPhoto){
            console.log("please choose one") // TODO: handle if user selected both media
            return
        }
    }

    private saveMetadata(id: any): void {
        // Save metadata
        const metadata: any = {
            id: id,
            userId: this.userId,
            channelId: sessionStorage.getItem('posting-channel'),
            timestamp: new Date()
        };

        this.multimediaService.addMultimediaMeta(metadata)
            .subscribe(() => {
                // Metadata saved successfully
                this.logger.log('Metadata saved successfully');
                this.postForm.reset();
                this.chosenPhoto = undefined;
                this.chosenVideo = undefined;
                // TODO: add alert or toggle to navigate user's profile posts
            }, (error) => {
                // Handle error
                this.logger.error('Error saving metadata:', error);
            });
    }

    openOptions(id:any){
        this.employeesService.getEmployeeById(id).subscribe(data =>{
            const dialogRef = this.dialog.open(PopingListComponent, {
                data: {data:[data]}
            })
        })
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

    selectedChannel: any =''


    constructor(private themeService: ThemeService,
                public multimediaService: MultimediaService,
                public dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public data: { data: any[] },
                public router: Router) {
        this.themeSubscription = this.themeService.getThemeObservable().subscribe((isDarkMode) => {
            this.isDarkMode = isDarkMode;
        });
    }

    navigateToProfile(id: any) {
        this.dialog.closeAll();
        this.router.navigate([`/profile/${id}/about/${id}`]);
    }

    convertToSafeUrl(url:any):SafeResourceUrl{
        return this.multimediaService.convertToSafeUrl(url,'image/jpeg')
    }

    selfUser(): boolean{
        let val:any[] = [];
        this.data.data.forEach(d => {
            if(d.id == localStorage.getItem('sender')){
                val = d.id;
            }
        })
        return val.length != 0;
    }

    selectChannel(){
        sessionStorage.setItem('posting-channel',this.selectedChannel)
    }
}
