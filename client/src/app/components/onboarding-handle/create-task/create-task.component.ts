import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OnboardinService} from "../../../services/onboardin.service";
import {EmployeesService} from "../../../services/employees.service";
import {AuthService} from "../../../services/auth.service";
import {forkJoin, Observable, tap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CreatePlanDialogComponent} from "../../../shared/dialogs/create-plan-dialog/create-plan-dialog.component";
import {CreateTaskDialogComponent} from "../../../shared/dialogs/create-task-dialog/create-task-dialog.component";
import {NotificationsService} from "../../../services/notifications.service";

@Component({
    selector: 'app-create-task',
    templateUrl: './create-task.component.html',
    styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent {

    userId: any
    employeeDataStore: any
    employee: any = {
        id: ''
    }
    tasksStore: any[] = [];
    plansStore: any[] = [];
    filteredTasks: any;
    filteredPlans: any;

    constructor(private route: ActivatedRoute,
                private dialog: MatDialog,
                private cookieService: AuthService,
                private snackBar: MatSnackBar,
                private employeesService: EmployeesService,
                private taskService: OnboardinService) {
    }

    async ngOnInit(): Promise<any> {
        await this.loadAllUsers().subscribe(() => {
            this.getUser();
        })

        await this.loadAllTasks().subscribe(() => {
            this.filterTasks();
        })

        await this.loadAllPlans().subscribe(() => {
        })
    }

    loadAllUsers(): Observable<any> {
        return this.employeesService.getAllEmployees().pipe(
            tap(data => this.employeeDataStore = data)
        );
    }

    loadAllTasks(): Observable<any> {
        return this.taskService.getAllTasks().pipe(
            tap(data => this.tasksStore = data)
        );
    }

    loadAllPlans(): Observable<any> {
        return this.taskService.getAllPlans().pipe(
            tap(data => this.plansStore = data)
        );
    }

    filterTasks(): any[] {
        this.filteredTasks = this.tasksStore.filter((data: any) => data.organizationId == this.employee.organizationId ? this.filteredTasks = [data] : this.filteredTasks = null)
        this.filteredTasks.sort((a: any, b: any) => {
            return new Date(b.startdate).getTime() - new Date(a.startdate).getTime()
        })

        return this.filteredTasks;
    }

    filterPlan(id: any): any {
        this.filteredPlans = this.plansStore.filter(data => data.id == id)

        return this.filteredPlans[0] ? this.filteredPlans[0].title : null
    }

    getUser() {
        this.userId = this.cookieService.userID().toString();
        return this.employee = this.employeeDataStore.find((emp: any) => emp.id === this.userId);
    }

    cratePlan() {
        const data = {
            userId: this.employee.id,
            userEmail: this.employee.email,
            userName: this.employee.name,
            organizationId: this.employee.organizationId
        }

        this.toggleDialog('', '', data, CreateTaskDialogComponent)
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
            this.loadAllTasks().subscribe(() => {
                this.filterTasks()
            });
            this.loadAllPlans().subscribe(() => {

            })
        })
    }

    openSnackBar(message: any, action: any) {
        this.snackBar.open(message, action, {duration: 3000})
    }

    openEdit(d:any) {
        const data = {
            taskId: d.id,
            task:d,
            userId: this.employee.id,
            userName: this.employee.name,
            userEmail: this.employee.email,
            organizationId: this.employee.organizationId
        }

        this.toggleDialog('', '', data, CreateTaskDialogComponent)
    }
}
