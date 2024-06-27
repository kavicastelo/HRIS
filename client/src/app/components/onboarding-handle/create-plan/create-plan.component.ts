import {Component} from '@angular/core';
import {OnboardinService} from "../../../services/onboardin.service";
import {EmployeesService} from "../../../services/employees.service";
import {AuthService} from "../../../services/auth.service";
import {forkJoin, Observable, tap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
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
    id: ''
  }
  plansStore: any[] = [];
  filteredPlans: any;
  filteredTemplates: any[] = [];

  targetInput: any;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private cookieService: AuthService,
              private snackBar: MatSnackBar,
              private employeesService: EmployeesService,
              private planService: OnboardinService) {
  }

  async ngOnInit(): Promise<any> {
    this.loadAllUsers().subscribe(() => {
      this.getUser();
    })

    this.loadAllPlans().subscribe(() => {
      this.filterPlans();
      this.filterTemplates();
    })
  }

  loadAllUsers(): Observable<any> {
    return this.employeesService.getAllEmployees().pipe(
      tap(data => this.employeeDataStore = data)
    );
  }

  loadAllPlans(): Observable<any> {
    return this.planService.getAllPlans().pipe(
      tap(data => this.plansStore = data)
    );
  }

  handleSearch(data: any): void {
    this.targetInput = data as HTMLInputElement;
    const value = this.targetInput.value
    if (value) {
      this.filteredPlans = this.plansStore.filter((data: any) =>
        data.organizationId === this.employee.organizationId && data.title.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.filteredPlans = this.plansStore.filter((data: any) => data.organizationId === this.employee.organizationId);
    }
  }

  filterPlans(): any[] {
    if (this.targetInput == undefined) {
      this.filteredPlans = this.plansStore.filter((data: any) => data.organizationId == this.employee.organizationId && data.template == 'no' ? this.filteredPlans = [data] : this.filteredPlans = null)
    }

    this.filteredPlans.sort((a: any, b: any) => {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })

    return this.filteredPlans;
  }

  filterTemplates(): any[] {
    if (this.targetInput == undefined) {
      this.filteredTemplates = this.plansStore.filter((data: any) => data.organizationId == this.employee.organizationId && data.template == 'yes' ? this.filteredPlans = [data] : this.filteredPlans = null)
    }

    this.filteredTemplates.sort((a: any, b: any) => {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })

    return this.filteredTemplates
  }

  getUser() {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.userId = params['id'].toString();
        return this.employee = this.employeeDataStore.find((emp: any) => emp.id === this.userId);
      }
    })
  }

  cratePlan() {
    const data = {
      organizationId: this.employee.organizationId,
      userId: this.employee.id,
      userName: this.employee.name,
      userEmail: this.employee.email,
      department: this.employee.jobData.department,
      location: this.employee.jobData.location,
    }

    this.toggleDialog('', '', data, CreatePlanDialogComponent)
  }

  toggleDialog(title: any, msg: any, data: any, component: any) {
    const _popup = this.dialog.open(component, {
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '500ms',
      maxHeight: '80vh',
      data: {
        data: data,
        title: title,
        msg: msg
      }
    });
    _popup.afterClosed().subscribe(item => {
      this.loadAllPlans().subscribe(() => {
        // this.openSnackBar('Requests reloaded!', 'OK')
      });
    })
  }

  openSnackBar(message: any, action: any) {
    this.snackBar.open(message, action, {duration: 3000})
  }
}
