import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OnboardinService} from "../../services/onboardin.service";
import {EmployeesService} from "../../services/employees.service";
import {forkJoin, Observable, tap} from "rxjs";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-onboarding-handle',
  templateUrl: './onboarding-handle.component.html',
  styleUrls: ['./onboarding-handle.component.scss']
})
export class OnboardingHandleComponent implements OnInit{

  employeeDataStore:any[] = [];
  planDataStore:any[] = [];
  taskDataStore:any[] = [];
  filteredEmployees:any[] = [];
  filteredPlans:any[] = [];
  filteredTasks:any[] = [];
  selectedPlan:any;
  selectedTask:any;
  organizationId:any;

  isChecked: boolean[] = [];
  selectedEmployeeIds: string[] = [];
  selectedEmployees: any[] = [];

  onboardinPlanForm = new FormGroup({
    titlePlan: new FormControl(null, [Validators.required]),
    descriptionPlan: new FormControl(null, [Validators.required]),
    startDatePlan: new FormControl(null, [Validators.required]),
    endDatePlan: new FormControl(null, [Validators.required])
  })

  onboardinTaskForm = new FormGroup({
    onboardingPlanId: new FormControl(null, [Validators.required]),
    adminEmailTask: new FormControl(null, [Validators.required]),
    descriptionTask: new FormControl(null, [Validators.required]),
    startDateTask: new FormControl(null, [Validators.required]),
    endDateTask: new FormControl(null, [Validators.required]),
    statusTask: new FormControl(null, [Validators.required])
  })

  assignForm = new FormGroup({
    plan: new FormControl(null, [Validators.required]),
    task: new FormControl(null, [Validators.required])
  })

  constructor(private onboardinService: OnboardinService, private employeeService: EmployeesService, private cookiesService: AuthService) {
  }

  ngOnInit(): void {
    this.organizationId = this.cookiesService.organization();
    this.loadAllUsers().subscribe(()=>{
      this.filterEmployees()
    })
    this.loadAllPlans().subscribe(()=>{})
    this.loadAllTasks().subscribe(()=>{})
  }

  loadAllUsers(): Observable<any>{
    return this.employeeService.getAllEmployees().pipe(
        tap(data => this.employeeDataStore = data)
    );
  }

  loadAllPlans(): Observable<any>{
    return this.onboardinService.getAllPlans().pipe(
        tap(data => this.planDataStore = data)
    );
  }

  loadAllTasks(): Observable<any>{
    return this.onboardinService.getAllTasks().pipe(
        tap(data => this.taskDataStore = data)
    );
  }

  filterEmployees(): any[]{
    this.filteredEmployees = this.employeeDataStore.filter((data:any)=> data.organizationId == this.organizationId);

    return this.filteredEmployees;
  }

  toggleSelection(checked: boolean, employeeId: string) {
    if (checked) {
      this.selectedEmployeeIds.push(employeeId); // Add employee ID if the checkbox is checked
    } else {
      const index = this.selectedEmployeeIds.indexOf(employeeId);
      if (index !== -1) {
        this.selectedEmployeeIds.splice(index, 1); // Remove employee ID if the checkbox is unchecked
      }
    }
  }

  filterPlans(): any[]{
    this.filteredPlans = this.planDataStore.filter((data:any)=> data.organizationId == this.organizationId);

    return this.filteredPlans;
  }

  filterTasks(): any[]{
    this.filteredTasks = this.taskDataStore.filter((data:any)=> data.organizationId == this.organizationId);

    return this.filteredTasks;
  }

  submitPlan(){
    if (this.onboardinPlanForm.valid){
      this.onboardinService.saveOnboardingPlan({
        title: this.onboardinPlanForm.value.titlePlan,
        organizationId: this.organizationId,
        description: this.onboardinPlanForm.value.descriptionPlan,
        startDate: this.onboardinPlanForm.value.startDatePlan,
        taskDate: this.onboardinPlanForm.value.endDatePlan
      }).subscribe(data=>{
        console.log(data)
      }, error => {
        console.log(error)
      })
    }
  }

  submitTask(){
    if (this.onboardinTaskForm.valid){
      this.onboardinService.saveOnboardin({
        organizationId: this.organizationId,
        onBoardingPlanId: this.onboardinTaskForm.value.onboardingPlanId,
        adminEmail: this.onboardinTaskForm.value.adminEmailTask,
        description: this.onboardinTaskForm.value.descriptionTask,
        startdate: this.onboardinTaskForm.value.startDateTask,
        taskdate: this.onboardinTaskForm.value.endDateTask,
        status: this.onboardinTaskForm.value.statusTask,
      }).subscribe(data=>{
        console.log(data)
      }, error => {
        console.log(error)
      })
    }
  }

  assignEmployees(event: Event) {
    event.preventDefault();
    if (this.assignForm.valid && this.selectedEmployeeIds.length > 0) {
      const requests = this.selectedEmployeeIds.map(id => this.employeeService.getEmployeeById(id));

      forkJoin(requests).subscribe(employees => {
        // Clear the selected employees array
        this.selectedEmployees = [];

        // Add each employee to the selectedEmployees array if it's not already present
        employees.forEach(emp => {
          if (!this.selectedEmployees.some(selectedEmp => selectedEmp.id === emp.id)) {
            this.selectedEmployees.push(emp);
          }
        });

        // Now that the selectedEmployees array is populated with unique employees, make the HTTP request
        this.onboardinService.assignEmployeeToTask(this.assignForm.value.task, this.selectedEmployees).subscribe(data => {
          console.log(data);
          this.selectedEmployeeIds = [];
        }, error => {
          console.log(error);
        });
      });
    }
  }

}
