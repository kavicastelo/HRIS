import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {Observable, tap} from "rxjs";
import {EmployeesService} from "../../../services/employees.service";
import {
    RequestTransferDialogComponent
} from "../../../shared/dialogs/request-transfer-dialog/request-transfer-dialog.component";
import {TransferRequestService} from "../../../services/transfer-request.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LetterDataDialogComponent} from "../../../shared/dialogs/letter-data-dialog/letter-data-dialog.component";
import {AuthService} from "../../../services/auth.service";

@Component({
    selector: 'app-transfer-request',
    templateUrl: './transfer-request.component.html',
    styleUrls: ['./transfer-request.component.scss']
})
export class TransferRequestComponent implements OnInit {

    userId: any
    employeeDataStore: any
    employee: any = {
        id:''
    }
    transferRequestsStore: any[] = [];
    filteredRequests: any;

    constructor(private route: ActivatedRoute, private dialog: MatDialog, private cookieService: AuthService, private snackBar: MatSnackBar, private employeesService: EmployeesService, private transferService: TransferRequestService) {
    }

    async ngOnInit(): Promise<any> {
        this.loadAllUsers().subscribe(()=>{
            this.getUser();
        })

        this.loadAllTransferRequests().subscribe(()=>{
            this.filterLetters();
        })
    }

    loadAllUsers(): Observable<any>{
        return this.employeesService.getAllEmployees().pipe(
            tap(data => this.employeeDataStore = data)
        );
    }

    loadAllTransferRequests(): Observable<any> {
        return this.transferService.getAllTransfer().pipe(
            tap(data => this.transferRequestsStore = data)
        );
    }

    filterLetters(): any[]{
        this.filteredRequests = this.transferRequestsStore.filter((data:any) => data.userId == this.employee.id? this.filteredRequests = [data]: this.filteredRequests = null)
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
            this.loadAllTransferRequests().subscribe(()=>{
                this.openSnackBar('Requests reloaded!', 'OK')
            });
        })
    }

    openSnackBar(message: any, action: any){
        this.snackBar.open(message, action, {duration:3000})
    }

    deleteRequest(id: any) {
        if (id){
            if (confirm('Are you sure you want to delete this request?')){
                this.transferService.deleteTransfer(id).subscribe(data => {
                    this.loadAllTransferRequests().subscribe(()=>{
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

            this.toggleDialog('Edit transfer request', 'Are you sure you want to edit this request?'+'\n'+
                ' You can only perform this for \'PENDING\' requests.', data, RequestTransferDialogComponent)
        }
    }

    popupData(id: any) {
        const data = this.filteredRequests.filter((request:any) => request.id == id);

        this.toggleDialog('','', data, LetterDataDialogComponent)
    }
}
