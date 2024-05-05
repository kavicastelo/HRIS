export interface PayrollReportModel{
    id: String;
    organizationId: String;
    email: String;
    reportDescription: String;
    reportType: String;
    workedDays: number;
    payItems: { itemName: string, description: string, amount: number }[];
    deductions: { itemName: string, description: string, amount: number }[];
    totalEarnings: number;
    totalDeductions: number;
    netPay: number;
    payPeriod: String; // July 2024, etc...
    reportGeneratedDate: String;
    status: String;
}