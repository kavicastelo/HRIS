import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ThemeService} from "../../../services/theme.service";
import {Subscription} from "rxjs";
import {employeeDataStore} from "../../data-stores/employee-data-store";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {NgClass, NgFor, NgIf} from "@angular/common";
import {MatSelectModule} from "@angular/material/select";
import {Router} from "@angular/router";

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

  userId: string = "3";

  private themeSubscription: Subscription;
  isDarkMode: boolean | undefined;

  // test data for profile
  employeeDataStore = employeeDataStore
  employee: any

  constructor(
    private themeService: ThemeService, private dialog: MatDialog, private router: Router) {
    this.themeSubscription = this.themeService.getThemeObservable().subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    employeeDataStore.forEach((emp) => {
      if (emp.id == this.userId) {
        this.employee = [emp];
      }
    })
  }

  openVideoDialog() {
    const dialogRef = this.dialog.open(PostVideoComponent, {
      data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
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
