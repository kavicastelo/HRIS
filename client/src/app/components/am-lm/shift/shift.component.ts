import {Component, OnInit} from '@angular/core';
import {shiftDataStore} from "../../../shared/data-stores/shift-data-store";
import {MatDialog} from "@angular/material/dialog";
import {CreateShiftDialogComponent} from "../../../shared/dialogs/create-shift-dialog/create-shift-dialog.component";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class ShiftComponent implements OnInit{

  organizationId:any;
  shiftStore:any = shiftDataStore

  constructor(private dialog: MatDialog, private cookieService: AuthService) {
  }
  ngOnInit() {
    this.organizationId = this.cookieService.organization();
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
