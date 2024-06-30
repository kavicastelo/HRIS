import {Component, Inject, OnInit} from '@angular/core';
import {OnboardinService} from "../../../services/onboardin.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Observable, tap} from "rxjs";
import {CreateTaskDialogComponent} from "../create-task-dialog/create-task-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-onboarding-task-view',
  templateUrl: './onboarding-task-view.component.html',
  styleUrls: ['./onboarding-task-view.component.scss']
})
export class OnboardingTaskViewComponent implements OnInit {

  receivedData: any
  plansStore: any[] = []
  tasksStore: any[] = []
  filteredPlans: any[] = []
  filteredTasks: any[] = []
  constructor(private onboardingService: OnboardinService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<OnboardingTaskViewComponent>) {
  }

  async ngOnInit(): Promise<any> {
    this.receivedData = this.data

    await this.loadAllPlans().subscribe(() => {
      this.filterPlans()
    })

    await this.loadAllTasks().subscribe(() => {
      this.filterTasks()
    })
  }

  loadAllPlans(): Observable<any> {
    return this.onboardingService.getAllPlans().pipe(
      tap(data => this.plansStore = data)
    )
  }

  filterPlans(): any[] {
    this.filteredPlans = this.plansStore.filter((p: any) => p.id == this.receivedData.data.planId)
    return this.filteredPlans
  }

  loadAllTasks(): Observable<any> {
    return this.onboardingService.getAllTasks().pipe(
      tap(data => this.tasksStore = data)
    )
  }

  filterTasks(): any[] {
    this.filteredTasks = this.tasksStore.filter((t: any) => t.id == this.receivedData.data.taskId)
    return this.filteredTasks
  }

  closePopup() {
    this.ref.close()
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
      //TODO: load all onboarding plans
    })
  }

  editTask(t: any, p: any) {
    const data = {
      taskId: t.id,
      task:t,
      userId: p.empId,
      userName: p.empName,
      userEmail: t.adminEmail,
      organizationId: t.organizationId
    }

    this.toggleDialog('', '', data, CreateTaskDialogComponent)
    this.closePopup()
  }

  deleteTask(t: any) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.onboardingService.deleteOnboarding(t.id).subscribe(() => {
        this.closePopup();
        this.snackBar.open('Task deleted successfully', 'Close', {
          duration: 3000
        })
      })
    }
  }
}
