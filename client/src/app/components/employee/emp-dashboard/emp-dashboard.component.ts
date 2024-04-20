import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EmployeesService} from "../../../services/employees.service";
import {TransferRequestService} from "../../../services/transfer-request.service";
import {Observable, tap} from "rxjs";
import {
  RequestTransferDialogComponent
} from "../../../shared/dialogs/request-transfer-dialog/request-transfer-dialog.component";
import {LetterDataDialogComponent} from "../../../shared/dialogs/letter-data-dialog/letter-data-dialog.component";
import {SafeResourceUrl} from "@angular/platform-browser";
import {MultimediaService} from "../../../services/multimedia.service";

@Component({
  selector: 'app-emp-dashboard',
  templateUrl: './emp-dashboard.component.html',
  styleUrls: ['./emp-dashboard.component.scss']
})
export class EmpDashboardComponent implements OnInit{

  userId: any
  employeeDataStore: any[] = []
  employee: any = {
    id:''
  }
  filteredEmployees: any[] = [];
  targetInput:any;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router,
              private cookieService: AuthService,
              private snackBar: MatSnackBar,
              private employeesService: EmployeesService,
              private multimediaService: MultimediaService) {
  }

  async ngOnInit(): Promise<any> {
    this.loadAllUsers().subscribe(()=>{
      this.getUser();
    })
  }

  loadAllUsers(): Observable<any>{
    return this.employeesService.getAllEmployees().pipe(
        tap(data => this.employeeDataStore = data)
    );
  }

  filterEmployees(): any[]{
    if (this.targetInput == undefined){
      this.filteredEmployees = this.employeeDataStore.filter((data:any) => data.organizationId == this.employee.organizationId? this.filteredEmployees = [data]: this.filteredEmployees = [])
    }
    this.filteredEmployees.sort((a:any, b:any) => {
      return new Date(b.jobData.doj).getTime() - new Date(a.jobData.doj).getTime()
    })

    return this.filteredEmployees;
  }

  handleSearch(data: any): void {
    this.targetInput = data as HTMLInputElement;
    const value = this.targetInput.value
    if (value) {
      this.filteredEmployees = this.employeeDataStore.filter((data: any) =>
          data.organizationId === this.employee.organizationId && data.name.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.filteredEmployees = this.employeeDataStore.filter((data: any) => data.organizationId === this.employee.organizationId);
    }
  }

  getUser() {
    this.userId = this.cookieService.userID().toString();
    return this.employee = this.employeeDataStore.find((emp: any) => emp.id === this.userId);
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

    })
  }

  openSnackBar(message: any, action: any){
    this.snackBar.open(message, action, {duration:3000})
  }

  deleteEmployee(id: any) {
    if (id){
      if (confirm('Are you sure you want to delete this request?')){
        this.employeesService.deleteEmployeeById(id).subscribe(data =>{
          console.log(data)
          this.loadAllUsers().subscribe(()=>{
            this.filterEmployees()
          })
        }, error => {
          console.log(error)
        })
      }
    }
  }

  editEmployee(id: any) {
    if (id){
    }
  }

  navigateToProfile(id: any) {
    this.router.navigate([`/profile/${id}/about/${id}`]);
  }

  convertToSafeUrl(url:any):SafeResourceUrl{
    return this.multimediaService.convertToSafeUrl(url,'image/jpeg')
  }
}
