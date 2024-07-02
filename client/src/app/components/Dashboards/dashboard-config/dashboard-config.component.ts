import {Component, OnInit} from '@angular/core';
import {Observable, tap} from "rxjs";
import {ShiftsService} from "../../../services/shifts.service";
import {AuthService} from "../../../services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateShiftDialogComponent} from "../../../shared/dialogs/create-shift-dialog/create-shift-dialog.component";
import {OrganizationService} from "../../../services/organization.service";
import {EmployeesService} from "../../../services/employees.service";

@Component({
  selector: 'app-dashboard-config',
  templateUrl: './dashboard-config.component.html',
  styleUrls: ['./dashboard-config.component.scss']
})
export class DashboardConfigComponent implements OnInit{

  organizationId: any
  organization: any

  constructor(
    private dialog: MatDialog,
    private cookieService: AuthService,
    private organizationService: OrganizationService,
    private employeesService: EmployeesService
  ) {

  }
  async ngOnInit(): Promise<any> {
    this.organizationId = this.cookieService.organization().toString()

    await this.getOrganization().subscribe(()=>{})
  }

  getOrganization(): Observable<any> {
    return this.organizationService.getOrganizationById(this.organizationId).pipe(
      tap(data => this.organization = data)
    )
  }

  toggleDialog(title: any, msg: any, data: any, component: any) {
    const _popup = this.dialog.open(component, {
      maxHeight: '80vh',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        data: data,
        title: title,
        msg: msg
      }
    });
    _popup.afterClosed().subscribe(item => {
      //TODO: do something after close the popup
    })
  }

  addShift() {
    const data = {
      organizationId: this.organizationId
    }
    this.toggleDialog('', '', data, CreateShiftDialogComponent)
  }
}
