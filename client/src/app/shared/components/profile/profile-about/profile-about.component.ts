import {Component, OnInit} from '@angular/core';
import {employeeDataStore} from "../../../data-stores/employee-data-store";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ThemeService} from "../../../../services/theme.service";
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'app-profile-about',
  templateUrl: './profile-about.component.html',
  styleUrls: ['./profile-about.component.scss']
})
export class ProfileAboutComponent implements OnInit {
  employeeDataStore = employeeDataStore
  employee: any
  userId: any;

  constructor(private themeService: ThemeService, private dialog: MatDialog, private router: Router, private route: ActivatedRoute, private logger: NGXLogger) {
  }
  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    employeeDataStore.forEach((emp) => {
      this.route.paramMap.subscribe(params => {
        this.userId = params.get('id');

        if (emp.id == this.userId) {
          this.employee = [emp];
          this.logger.info(emp)
        }
      })
    })
  }
}
