import {Component, OnInit} from '@angular/core';
import {shiftDataStore} from "../../../shared/data-stores/shift-data-store";
import {MatDialog} from "@angular/material/dialog";
import {CreateShiftDialogComponent} from "../../../shared/dialogs/create-shift-dialog/create-shift-dialog.component";
import {AuthService} from "../../../services/auth.service";
import {ShiftsService} from "../../../services/shifts.service";
import {Observable, tap} from "rxjs";

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class ShiftComponent implements OnInit{

  organizationId:any;
  shiftDataStore:any[] = [];
  filteredShifts:any[] = [];

  constructor(private dialog: MatDialog, private cookieService: AuthService, private shiftService: ShiftsService) {
  }
  async ngOnInit(): Promise<any> {
    this.organizationId = this.cookieService.organization();

    await this.loadAllShifts().subscribe(()=>{

    })
  }

  loadAllShifts(): Observable<any>{
    return this.shiftService.getAllShifts().pipe(
        tap(data => this.shiftDataStore = data)
    );
  }

  filterShifts(): any[]{
    this.filteredShifts = this.shiftDataStore.filter((data: any) => data.organizationId === this.organizationId)

    return this.filteredShifts;
  }

  addShift() {
    const data = {
      organizationId: this.organizationId
    }
    this.toggleDialog('', '', data, CreateShiftDialogComponent)
  }

  toggleDialog(title: any, msg: any, data: any, component: any) {
    const _popup = this.dialog.open(component, {
      width: '350px',
      maxHeight: '70%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        data: data,
        title: title,
        msg: msg
      }
    });
    _popup.afterClosed().subscribe(item => {
      //TODO: do something here
    })
  }
}
