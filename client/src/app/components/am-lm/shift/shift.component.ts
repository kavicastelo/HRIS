import { Component } from '@angular/core';
import {shiftDataStore} from "../../../shared/data-stores/shift-data-store";

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class ShiftComponent {

  shiftStore:any = shiftDataStore

  addShift() {

  }
}
