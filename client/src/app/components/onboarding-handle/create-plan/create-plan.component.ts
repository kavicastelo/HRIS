import {Component} from '@angular/core';
import {OnboardinService} from "../../../services/onboardin.service";
import {EmployeesService} from "../../../services/employees.service";
import {AuthService} from "../../../services/auth.service";
import {forkJoin, Observable, tap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CreatePlanDialogComponent} from "../../../shared/dialogs/create-plan-dialog/create-plan-dialog.component";
import {OnboardingPlanViewComponent} from "../../../shared/dialogs/onboarding-plan-view/onboarding-plan-view.component";

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.scss']
})
export class CreatePlanComponent {

  userId: any
  organizationId: any
  employeeDataStore: any
  employee: any
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
    this.organizationId = this.cookieService.organization().toString();
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
        data.organizationId === this.organizationId && data.title.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.filteredPlans = this.plansStore.filter((data: any) => data.organizationId === this.organizationId);
    }
  }

  filterPlans(): any[] {
    if (this.targetInput == undefined) {
      this.filteredPlans = this.plansStore.filter((data: any) => data.organizationId == this.organizationId && data.template == 'no' ? this.filteredPlans = [data] : this.filteredPlans = null)
    }

    this.filteredPlans.sort((a: any, b: any) => {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })

    return this.filteredPlans;
  }

  filterTemplates(): any[] {
    if (this.targetInput == undefined) {
      this.filteredTemplates = this.plansStore.filter((data: any) => data.organizationId == this.organizationId && data.template == 'yes' ? this.filteredPlans = [data] : this.filteredPlans = null)
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
      organizationId: this.organizationId,
      userId: this.employee?this.employee.id:'',
      userName: this.employee?this.employee.name:'',
      userEmail: this.employee?this.employee.email:'',
      department: this.employee?this.employee.jobData.department:'',
      location: this.employee?this.employee.jobData.location:'',
      data:{id:''}
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
        this.filterTemplates();
        this.filterPlans();
      });
    })
  }

  openSnackBar(message: any, action: any) {
    this.snackBar.open(message, action, {duration: 3000})
  }

  editTemplate(tp: any) {
    const data = {
      organizationId: this.organizationId,
      id: tp.id,
      userId: this.employee?this.employee.id:tp.empId,
      userName: this.employee?this.employee.name:tp.empName,
      userEmail: this.employee?this.employee.email:tp.empEmail,
      department: this.employee?this.employee.jobData.department:tp.department,
      location: this.employee?this.employee.jobData.location:tp.location,
      data:tp
    }
    this.toggleDialog('', '', data, CreatePlanDialogComponent)
  }

  viewPlan(p: any) {
    this.toggleDialog('', '', p, OnboardingPlanViewComponent)
  }
}
