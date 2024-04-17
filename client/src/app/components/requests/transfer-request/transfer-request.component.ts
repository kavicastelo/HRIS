import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {Observable, tap} from "rxjs";
import {EmployeesService} from "../../../services/employees.service";
import {
    RequestTransferDialogComponent
} from "../../../shared/dialogs/request-transfer-dialog/request-transfer-dialog.component";
import {TransferRequestService} from "../../../services/transfer-request.service";

@Component({
    selector: 'app-transfer-request',
    templateUrl: './transfer-request.component.html',
    styleUrls: ['./transfer-request.component.scss']
})
export class TransferRequestComponent implements OnInit {

    userId: any
    employeeDataStore: any
    employee: any
    transferRequestsStore: any;

    constructor(private route: ActivatedRoute, private dialog: MatDialog, private employeesService: EmployeesService, private transferService: TransferRequestService) {
    }

    async ngOnInit(): Promise<any> {
        this.loadAllUsers().subscribe(()=>{
            this.getUser();
        })

        this.loadAllTransferRequests().subscribe(()=>{
            //TODO: do something
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

    getUser() {
        this.userId = localStorage.getItem('sender');
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
            //TODO: do something
        })
    }
}
