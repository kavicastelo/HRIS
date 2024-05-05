export interface SummaryReportModel{
    id: string;
    organizationId: string;
    reportDescription: string;
    employeePayments: { employeeName: string, earnings: number, deductions: number, netPay: number }[];
    totalEarnings: number;
    totalDeductions: number;
    netPayTotal: number;
    reportType: string;
    payPeriod: string; // July 2024, etc...
    reportGeneratedDate: string;
    status: string;
}