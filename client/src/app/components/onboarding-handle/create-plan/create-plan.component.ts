import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OnboardinService} from "../../../services/onboardin.service";
import {EmployeesService} from "../../../services/employees.service";
import {AuthService} from "../../../services/auth.service";
import {forkJoin, Observable, tap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TransferRequestService} from "../../../services/transfer-request.service";
import {
  RequestTransferDialogComponent
} from "../../../shared/dialogs/request-transfer-dialog/request-transfer-dialog.component";
import {LetterDataDialogComponent} from "../../../shared/dialogs/letter-data-dialog/letter-data-dialog.component";
import {CreatePlanDialogComponent} from "../../../shared/dialogs/create-plan-dialog/create-plan-dialog.component";

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.scss']
})
export class CreatePlanComponent {

  userId: any
  employeeDataStore: any
  employee: any = {
    id:''
  }
  plansStore: any[] = [];
  filteredPlans: any;

  constructor(private route: ActivatedRoute, private dialog: MatDialog, private cookieService: AuthService, private snackBar: MatSnackBar, private employeesService: EmployeesService, private planService: OnboardinService) {
  }

  async ngOnInit(): Promise<any> {
    this.loadAllUsers().subscribe(()=>{
      this.getUser();
    })

    this.loadAllPlans().subscribe(()=>{
      this.filterPlans();
    })
  }

  loadAllUsers(): Observable<any>{
    return this.employeesService.getAllEmployees().pipe(
        tap(data => this.employeeDataStore = data)
    );
  }

  loadAllPlans(): Observable<any> {
    return this.planService.getAllPlans().pipe(
        tap(data => this.plansStore = data)
    );
  }

  filterPlans(): any[]{
    this.filteredPlans = this.plansStore.filter((data:any) => data.organizationId == this.employee.organizationId? this.filteredPlans = [data]: this.filteredPlans = null)
    this.filteredPlans.sort((a:any, b:any) => {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })

    return this.filteredPlans;
  }

  getUser() {
    this.userId = this.cookieService.userID().toString();
    return this.employee = this.employeeDataStore.find((emp: any) => emp.id === this.userId);
  }

  cratePlan() {
    const data = {
      userId: this.employee.id,
      organizationId: this.employee.organizationId
    }

    this.toggleDialog('', '', data, CreatePlanDialogComponent)
  }

  toggleDialog(title: any, msg: any, data: any, component: any) {
    const _popup = this.dialog.open(component, {
      width: '350px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        data: data,
        title: title,
        msg: msg
      }
    });
    _popup.afterClosed().subscribe(item => {
      this.loadAllPlans().subscribe(()=>{
        // this.openSnackBar('Requests reloaded!', 'OK')
      });
    })
  }

  openSnackBar(message: any, action: any){
    this.snackBar.open(message, action, {duration:3000})
  }
}
