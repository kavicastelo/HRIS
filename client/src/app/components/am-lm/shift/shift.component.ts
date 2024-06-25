import {Component, OnInit} from '@angular/core';
import {shiftDataStore} from "../../../shared/data-stores/shift-data-store";
import {MatDialog} from "@angular/material/dialog";
import {CreateShiftDialogComponent} from "../../../shared/dialogs/create-shift-dialog/create-shift-dialog.component";
import {AuthService} from "../../../services/auth.service";
import {ShiftsService} from "../../../services/shifts.service";
import {Observable, tap} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class ShiftComponent implements OnInit{

  organizationId:any;
  shiftDataStore:any[] = [];
  filteredShifts:any[] = [];

  constructor(private dialog: MatDialog, private cookieService: AuthService, private shiftService: ShiftsService, private snackBar: MatSnackBar) {
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

  editShift(shift: any) {
    const data = {
      id: shift.id,
      organizationId: this.organizationId,
      shift: shift
    }
    this.toggleDialog('', '', data, CreateShiftDialogComponent)
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
      this.loadAllShifts().subscribe(()=>{
        this.filterShifts()
      })
    })
  }

  deleteShift(s: any) {
    if (confirm('Are you sure you want to delete this shift?')) {
      this.shiftService.deleteShift(s.id).subscribe(() => {
        this.loadAllShifts().subscribe(()=>{
          this.filterShifts()
        })
        this.snackBar.open('Shift deleted successfully', 'OK', {
          duration: 3000
        })
      }, error => {
        this.snackBar.open(error.error.message, '', {
          duration: 3000
        })
      })
    }
  }
}
