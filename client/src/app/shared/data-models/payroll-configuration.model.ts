import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class PayrollConfigurationModel {
    id: String = "";
    organizationId: String = "";
    payrollFrequency: String = "Monthly";
    payrollPeriodStartDate: number = 1;
    payrollPeriodEndDate: number = 1;
    deadlineToRunPayroll: number = 1;
    payDay: number = 1;
}