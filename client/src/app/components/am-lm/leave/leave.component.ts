import { Component } from '@angular/core';
import {leaveDataStore} from "../../../shared/data-stores/leave-data-store";

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})
export class LeaveComponent {

  leaveStore:any = leaveDataStore;
}
