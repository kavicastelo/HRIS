import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
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
  filteredEmployees: any;

  constructor(private route: ActivatedRoute, private dialog: MatDialog, private cookieService: AuthService, private snackBar: MatSnackBar, private employeesService: EmployeesService, private multimediaService: MultimediaService) {
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
    this.filteredEmployees = this.employeeDataStore.filter((data:any) => data.organizationId == this.employee.organizationId? this.filteredEmployees = [data]: this.filteredEmployees = null)
    this.filteredEmployees.sort((a:any, b:any) => {
      return new Date(b.jobData.doj).getTime() - new Date(a.jobData.doj).getTime()
    })

    return this.filteredEmployees;
  }

  getUser() {
    this.userId = this.cookieService.userID().toString();
    return this.employee = this.employeeDataStore.find((emp: any) => emp.id === this.userId);
  }

  requestLetter() {
    const data = {
      userId: this.employee.id,
    }

    this.toggleDialog('Request Transfer Letter', 'Describe the reason why you need a transfer?', data, RequestTransferDialogComponent)
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

  deleteRequest(id: any) {
    if (id){
      if (confirm('Are you sure you want to delete this request?')){
        // this.transferService.deleteTransfer(id).subscribe(data => {
        //
        // }, error => {
        //   console.log(error)
        // })
      }
    }
  }

  editRequest(id: any, approved: any, reason: any) {
    if (id){
      const data = {
        id: id,
        text: reason,
        approved: approved
      }

      this.toggleDialog('Edit transfer request', 'Are you sure you want to edit this request?'+'\n'+
          ' You can only perform this for \'PENDING\' requests.', data, RequestTransferDialogComponent)
    }
  }

  popupData(id: any) {
    // const data = this.filteredRequests.filter((request:any) => request.id == id);
    //
    // this.toggleDialog('','', data, LetterDataDialogComponent)
  }

  convertToSafeUrl(url:any):SafeResourceUrl{
    return this.multimediaService.convertToSafeUrl(url,'image/jpeg')
  }
}
