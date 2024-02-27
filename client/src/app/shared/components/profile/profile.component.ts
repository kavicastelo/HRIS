import {Component, OnDestroy, OnInit} from '@angular/core';
import {ThemeService} from "../../../services/theme.service";
import {Subscription} from "rxjs";
import {employeeDataStore} from "../../data-stores/employee-data-store";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  private themeSubscription: Subscription;
  isDarkMode: boolean | undefined;

  // test data for profile
  employeeDataStore = employeeDataStore

  constructor(
    private themeService: ThemeService,) {
    this.themeSubscription = this.themeService.getThemeObservable().subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

  ngOnInit(): void {
  }
}
