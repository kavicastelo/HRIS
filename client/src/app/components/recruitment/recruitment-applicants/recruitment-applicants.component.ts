import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ShiftsService} from "../../../services/shifts.service";
import {AttendanceService} from "../../../services/attendance.service";
import {EmployeesService} from "../../../services/employees.service";
import {MultimediaService} from "../../../services/multimedia.service";
import {Observable, tap} from "rxjs";
import {SafeResourceUrl} from "@angular/platform-browser";
import {FormControl, FormGroup} from "@angular/forms";
import {RecruitmentService} from "../../../services/recruitment.service";

@Component({
  selector: 'app-recruitment-applicants',
  templateUrl: './recruitment-applicants.component.html',
  styleUrls: ['./recruitment-applicants.component.scss']
})
export class RecruitmentApplicantsComponent implements OnInit{

  userId: any
  organizationId: any
  employeeDataStore: any[] = [];
  shiftDataStore: any[] = [];
  attendanceDataStore: any[] = [];
  employee: any = {
    id:''
  }
  filteredEmployees: any[] = [];
  targetInput:any;

  selectedFilter: any;

  isChecked: boolean[] = [];
  selectedEmployeeIds: any[] = [];
  selectedEmployees: any[] = [];

  filterForm = new FormGroup({
    filter: new FormControl(''),
  })
  filteredJobTitles: any[] = [];

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router,
              private cookieService: AuthService,
              private snackBar: MatSnackBar,
              private shiftService: ShiftsService,
              private attendanceService: AttendanceService,
              private employeesService: RecruitmentService,
              private multimediaService: MultimediaService) {
  }

  async ngOnInit(): Promise<any> {
    this.userId = this.cookieService.userID().toString();
    this.organizationId = this.cookieService.organization().toString();

    await this.loadAllUsers().subscribe(()=>{
      this.filterEmployees();
      this.filterJobTitles();
      this.getUser();
      this.initializeCheckboxes();
    })
  }

  loadAllUsers(): Observable<any>{
    return this.employeesService.getAllApplicants().pipe(
      tap(data => this.employeeDataStore = data)
    );
  }

  filterEmployees(): any[]{
    if (this.targetInput === undefined){
      this.filteredEmployees = this.employeeDataStore.filter((data:any)=> data.organizationId == this.organizationId);
    }

    if (this.selectedFilter){
      if (this.selectedFilter == 'all'){
        return  this.filteredEmployees;
      } else if (this.selectedFilter == 'favorite'){
        this.filteredEmployees = this.filteredEmployees.filter((data:any)=> data.favorite == true);
      } else {
        this.filteredEmployees = this.filteredEmployees.filter((data:any)=> data.job_title == this.selectedFilter);
      }
    }

    return this.filteredEmployees;
  }

  filterJobTitles(){
    this.filteredEmployees.forEach(applicant => {
      if (!this.filteredJobTitles.includes(applicant.job_title)) {
        this.filteredJobTitles.push(applicant.job_title);
      }
    })
  }

  handleSearch(data: any): void {
    this.targetInput = data as HTMLInputElement;
    const value = this.targetInput.value
    if (value) {
      this.filteredEmployees = this.employeeDataStore.filter((data: any) =>
        data.organizationId === this.organizationId && data.name.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.filteredEmployees = this.employeeDataStore.filter((data: any) => data.organizationId === this.organizationId);
    }
  }

  getUser() {
    this.userId = this.cookieService.userID().toString();
    return this.employee = this.employeeDataStore.find((emp: any) => emp.id === this.userId);
  }

  openSnackBar(message: any, action: any){
    this.snackBar.open(message, action, {duration:3000})
  }

  initializeCheckboxes() {
    this.isChecked = Array(this.filteredEmployees.length).fill(false);
  }

  toggleSelection(checked: boolean, employeeId: any) {
    if (checked) {
      this.selectedEmployeeIds.push(employeeId); // Add employee ID if the checkbox is checked
    } else {
      const index = this.selectedEmployeeIds.indexOf(employeeId);
      if (index !== -1) {
        this.selectedEmployeeIds.splice(index, 1); // Remove employee ID if the checkbox is unchecked

        const topCheckbox = document.querySelector('input[type="checkbox"]:checked') as HTMLInputElement;
        if (topCheckbox) {
          topCheckbox.checked = false;
        }
      }
    }
  }

  toggleAllSelection(checked: boolean) {
    this.isChecked.fill(checked);
    if (checked) {
      this.selectedEmployeeIds = this.filteredEmployees.map(e => e.id);
    } else {
      this.selectedEmployeeIds = [];
    }
  }

  downloadCv(id:any) {
    if (id){
      this.employeesService.downloadCV(id).subscribe((data: any) => {
        const url = URL.createObjectURL(data);
        window.open(url);
      })
    }
    else {
      this.openSnackBar("Applicant not found", "OK")
    }
  }

  favRecruiter(id:any) {
    if (id){
      this.employeesService.setFavorite(id).subscribe((data: any) => {
        this.loadAllUsers().subscribe(() => {
          this.filterEmployees();
        })
      })
    }
    else {
      this.openSnackBar("Applicant not found", "OK")
    }
  }

  nextLevelRecruiter(id:any) {

  }

  editRecruiter(id:any) {

  }

  deleteRecruiter(id:any) {
    if (id){
      this.employeesService.deleteApplicantById(id).subscribe((data: any) => {
        this.loadAllUsers().subscribe(() => {
          this.filterEmployees();
        })
      })
    }
    else {
      this.openSnackBar("Applicant not found", "OK")
    }
  }
}
