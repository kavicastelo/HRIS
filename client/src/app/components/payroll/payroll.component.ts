import { Component, OnInit } from '@angular/core';
import {employeeDataStore } from "../../shared/data-stores/employee-data-store";
import { EmployeeModel } from "../../shared/data-models/Employee.model";
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MultimediaService } from 'src/app/services/multimedia.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss']
})
export class PayrollComponent {

  userId: any;
  loggedUserId: any;

  private themeSubscription: Subscription;
  isDarkMode: boolean | undefined;

  employeeDataStore:any;
  employee: any

  constructor(
      private themeService: ThemeService,
      private dialog: MatDialog,
      private router: Router) {
    this.themeSubscription = this.themeService.getThemeObservable().subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }

  navigateBetweenTabs(path: string) {
    this.router.navigate([`/payroll/${path}/`]);
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
    return this.router.url === `/payroll/${path}`;
  }
}
