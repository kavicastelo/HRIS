import {Component, OnInit} from '@angular/core';
import {employeeDataStore} from "../../data-stores/employee-data-store";
import {channelsDataStore} from "../../data-stores/channels-data-store";
import {MultimediaService} from "../../../services/multimedia.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  employeeDataStore = employeeDataStore;
  channelsDataStore = channelsDataStore;

  constructor(private multimediaService: MultimediaService, private router: Router) {
  }
  ngOnInit(): void {
    // convert base64 images to safe urls
    // this.employeeDataStore.forEach(emp => {
    //   emp.photo = this.multimediaService.convertToSafeUrl(emp.photo, 'image/jpeg');
    // })
  }

  navigateUrl(id: any) {
    this.router.navigate([`/feed/chat/${id}`]);
  }
}
