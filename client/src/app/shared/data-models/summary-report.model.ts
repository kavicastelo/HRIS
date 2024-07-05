import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class SummaryReportModel{
    id: string = "";
    organizationId: string = "";
    reportDescription: string = "";
    employeePayments: { employeeName: string, earnings: number, deductions: number, netPay: number }[] = [];
    totalEarnings: number = 0.0;
    totalDeductions: number = 0.0;
    netPayTotal: number = 0.0;
    reportType: string = "";
    payPeriod: string = ""; // July 2024, etc...
    reportGeneratedDate: string = "";
    status: string = "";
}