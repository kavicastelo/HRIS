import {Component, OnInit} from '@angular/core';
import {employeeDataStore} from "../../data-stores/employee-data-store";
import {channelsDataStore} from "../../data-stores/channels-data-store";

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  employeeDataStore = employeeDataStore;
  channelsDataStore = channelsDataStore;

  ngOnInit(): void {
  }

}
