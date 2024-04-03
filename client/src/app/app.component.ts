import {Component, OnInit} from '@angular/core';
import {ThemeService} from "./services/theme.service";
import {employeeDataStore} from "./shared/data-stores/employee-data-store";
import {WebSocketService} from "./services/web-socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';
  employeeDataStore = employeeDataStore;
  employee: any;
  userId:any;

  constructor(public themeService: ThemeService, private webSocketService: WebSocketService) {

  }

  ngOnInit(): void {
    localStorage.setItem('sender','1')
    this.userId = localStorage.getItem('sender')
    this.getUser()

    // Establish WebSocket connection
    this.webSocketService.connect('ws://localhost:4200/ws');

    this.webSocketService.getConnectionStatus().subscribe((status: boolean) => {
      console.log('WebSocket connection status:', status);
    }, (error: any) => {
      console.error('WebSocket connection error:', error);
    });
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
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
