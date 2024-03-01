import {Component, OnInit} from '@angular/core';
import {employeeDataStore} from "../../shared/data-stores/employee-data-store";

@Component({
  selector: 'app-feed-wrapper',
  templateUrl: './feed-wrapper.component.html',
  styleUrls: ['./feed-wrapper.component.scss']
})
export class FeedWrapperComponent implements OnInit {
  employeeDataStore = employeeDataStore
  employee: any
  userId:string = "3";

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
}
