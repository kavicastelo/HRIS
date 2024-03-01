import {Component, OnInit} from '@angular/core';
import {ThemeService} from "./services/theme.service";
import {employeeDataStore} from "./shared/data-stores/employee-data-store";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';
  employeeDataStore = employeeDataStore;
  employee: any;
  userId:string = "3";

  constructor(public themeService: ThemeService) {

  }

  ngOnInit(): void {
    this.getUser()
  }

  getUser() {
    employeeDataStore.forEach((emp) => {
      if (emp.id == this.userId) {
        this.employee = [emp];
      }
    })
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
