import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class PayrollConfigurationModel {
    id: String = "";
    organizationId: String = "";
    payrollFrequency: String = "Monthly";
    payrollPeriodStartDate: String = "";
    payrollPeriodInDays: number = 30;
    daysToRunPayroll: number = 1;
    daysToPayday: number = 1;
}