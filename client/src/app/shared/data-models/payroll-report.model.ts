export interface PayrollReportModel{
    id: string;
    organizationId: string;
    email: string;
    reportDescription: string;
    reportType: string;
    workedDays: number;
    payItems: { itemName: string, description: string, amount: number }[];
    deductions: { itemName: string, description: string, amount: number }[];
    totalEarnings: number;
    totalDeductions: number;
    netPay: number;
    payPeriod: string; // July 2024, etc...
    reportGeneratedDate: string;
    status: string;
}