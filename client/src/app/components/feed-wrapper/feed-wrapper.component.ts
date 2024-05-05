import {Component, OnInit} from '@angular/core';
import {employeeDataStore} from "../../shared/data-stores/employee-data-store";
import {WebSocketService} from "../../services/web-socket.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-feed-wrapper',
  templateUrl: './feed-wrapper.component.html',
  styleUrls: ['./feed-wrapper.component.scss']
})
export class FeedWrapperComponent implements OnInit {
  employeeDataStore = employeeDataStore
  employee: any
  userId:any;

  constructor(private cookieService: AuthService) {
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.userId = this.cookieService.userID().toString();
    employeeDataStore.forEach((emp) => {
      if (emp.id == this.userId) {
        this.employee = [emp];
      }
    })
  }
}
