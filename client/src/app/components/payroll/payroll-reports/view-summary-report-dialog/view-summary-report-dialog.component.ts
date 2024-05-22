import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { OrganizationService } from 'src/app/services/organization.service';
import { SummaryReportModel } from 'src/app/shared/data-models/summary-report.model';

@Component({
  selector: 'app-view-summary-report-dialog',
  templateUrl: './view-summary-report-dialog.component.html',
  styleUrls: ['./view-summary-report-dialog.component.scss']
})
export class ViewSummaryReportDialogComponent {
      summaryReportModel: SummaryReportModel;
      
      employeePaymentsTableColumns: string[] = ['employeeName', 'earnings', 'deductions', 'netPay'];
      employeePaymentsTabledataSource = new MatTableDataSource<{ employeeName: string, earnings: number, deductions: number, netPay: number }>([]);

      organizationName: String = "N/A";
      organizationEmail: String = "N/A";
      organizationAddress: String = "N/A";

      constructor(private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private cookieService: AuthService,
        private organizationService: OrganizationService
    ){
      this.summaryReportModel = data.summaryReportModel;
    }

    ngOnInit(): void {
      this.organizationService.getOrganizationById(this.cookieService.organization()).subscribe((res:any) => {
        this.organizationName = res.organizationName;
        this.organizationAddress = res.address;
        this.organizationEmail = res.email;
      });

      this.employeePaymentsTabledataSource.data = this.summaryReportModel.employeePayments;
    }
}
