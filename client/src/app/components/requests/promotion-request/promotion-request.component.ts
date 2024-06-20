import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EmployeesService} from "../../../services/employees.service";
import {Observable, tap} from "rxjs";
import {LetterDataDialogComponent} from "../../../shared/dialogs/letter-data-dialog/letter-data-dialog.component";
import {PromotionRequestService} from "../../../services/promotion-request.service";
import {
  RequestPromotionDialogComponent
} from "../../../shared/dialogs/request-promotion-dialog/request-promotion-dialog.component";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-promotion-request',
  templateUrl: './promotion-request.component.html',
  styleUrls: ['./promotion-request.component.scss']
})
export class PromotionRequestComponent {

  userId: any
  employeeDataStore: any
  employee: any = {
    id:''
  }
  promotionRequestsStore: any[] = [];
  filteredRequests: any;

  constructor(private route: ActivatedRoute, private dialog: MatDialog, private cookieService: AuthService, private snackBar: MatSnackBar, private employeesService: EmployeesService, private promotionService: PromotionRequestService) {
  }

  async ngOnInit(): Promise<any> {
    this.loadAllUsers().subscribe(()=>{
      this.getUser();
    })

    this.loadAllPromotionRequests().subscribe(()=>{
      this.filterLetters();
    })
  }

  loadAllUsers(): Observable<any>{
    return this.employeesService.getAllEmployees().pipe(
        tap(data => this.employeeDataStore = data)
    );
  }

  loadAllPromotionRequests(): Observable<any> {
    return this.promotionService.getAllPromotion().pipe(
        tap(data => this.promotionRequestsStore = data)
    );
  }

  filterLetters(): any[]{
    this.filteredRequests = this.promotionRequestsStore.filter((data:any) => data.userId == this.employee.id? this.filteredRequests = [data]: this.filteredRequests = null)
    this.filteredRequests.sort((a:any, b:any) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    return this.filteredRequests;
  }

  getUser() {
    this.userId = this.cookieService.userID().toString();
    return this.employee = this.employeeDataStore.find((emp: any) => emp.id === this.userId);
  }

  requestLetter() {
    const data = {
      userId: this.employee.id,
      organizationId: this.employee.organizationId
    }

    this.toggleDialog('Request Promotion Letter', 'Describe the reason why you need a promotion?', data, RequestPromotionDialogComponent)
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
      this.loadAllPromotionRequests().subscribe(()=>{
        // this.openSnackBar('Requests reloaded!', 'OK')
      });
    })
  }

  openSnackBar(message: any, action: any){
    this.snackBar.open(message, action, {duration:3000})
  }

  deleteRequest(id: any) {
    if (id){
      if (confirm('Are you sure you want to delete this request?')){
        this.promotionService.deletePromotion(id).subscribe(data => {
          this.loadAllPromotionRequests().subscribe(()=>{
            this.openSnackBar('Request deleted!', 'OK');
          });
        }, error => {
          console.log(error)
        })
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

      this.toggleDialog('Edit promotion request', 'Are you sure you want to edit this request?'+'\n'+
          ' You can only perform this for \'PENDING\' requests.', data, RequestPromotionDialogComponent)
    }
  }

  popupData(id: any) {
    const data = this.filteredRequests.filter((request:any) => request.id == id);

    this.toggleDialog('','', data, LetterDataDialogComponent)
  }
}
