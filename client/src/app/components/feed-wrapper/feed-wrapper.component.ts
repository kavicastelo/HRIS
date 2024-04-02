import {Component, OnInit} from '@angular/core';
import {employeeDataStore} from "../../shared/data-stores/employee-data-store";
import {WebSocketService} from "../../services/web-socket.service";

@Component({
  selector: 'app-feed-wrapper',
  templateUrl: './feed-wrapper.component.html',
  styleUrls: ['./feed-wrapper.component.scss']
})
export class FeedWrapperComponent implements OnInit {
  employeeDataStore = employeeDataStore
  employee: any
  userId:any;

  constructor(private webSocketService: WebSocketService) {
  }

  ngOnInit(): void {
    this.getUser();
    try {
      // Establish WebSocket connection
      this.webSocketService.connect('ws://localhost:4200/ws');

      this.webSocketService.getConnectionStatus().subscribe((status: boolean) => {
        console.log('WebSocket connection status:', status);
      });
    }
    catch (e) {
      console.log(e);
    }
  }

  getUser() {
    this.userId = localStorage.getItem('sender');
    employeeDataStore.forEach((emp) => {
      if (emp.id == this.userId) {
        this.employee = [emp];
      }
    })
  }
}
