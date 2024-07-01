import {Component, OnDestroy, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeModel } from '../../../../shared/data-models/Employee.model';
import { Observable, tap } from 'rxjs';
import { EmployeesService } from '../../../../services/employees.service';
import { AuthService } from '../../../../services/auth.service';
import {Router} from "@angular/router";

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-onboardin-main',
  templateUrl: './dashboard-onboardin-main.component.html',
  styleUrls: ['./dashboard-onboardin-main.component.scss'],
})
export class DashboardOnboardinMainComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  organizationId: any;

  offerLabels: any[] = ['Accepted', 'Rejected', 'Pending'];
  offerData: any[] = [25, 50, 75];
  offerChartCanvas: any;

  onboardingLabels: any[] = ['Pre Boarding', '1st Quarter', 'Last Quarter'];
  onboardingData: any[] = [25, 50, 75];
  onboardingChartCanvas: any;

  retentionLabels: any[] = ['Retained', 'Exits'];
  retentionData: any[] = [25, 50];
  retentionChartCanvas: any;

  employeeDataStore: EmployeeModel[] = [];
  filteredEmployees: EmployeeModel[] = [];

  displayedColumns: string[] = ['name', 'designation', 'doj', 'action'];
  paginatedEvents = new MatTableDataSource<EmployeeModel>();
  totalEvents = 0;
  pageSize = 5;

  constructor(private employeeService: EmployeesService,
              private cdr: ChangeDetectorRef,
              private router: Router,
              private cookieService: AuthService) {}

  ngOnInit() {
    this.organizationId = this.cookieService.organization().toString();

    this.renderOfferChart();
    this.renderOnboardingChart();
    this.renderRetentionChart();
  }

  ngAfterViewInit() {
    this.loadAllUsers().subscribe(() => {
      this.filterEmployees();
      this.paginateEvents();
      // this.paginatedEvents.paginator = this.paginator;
    });
  }

  ngOnDestroy() {
    if (this.offerChartCanvas) {
      this.offerChartCanvas.destroy();
    }
    if (this.onboardingChartCanvas) {
      this.onboardingChartCanvas.destroy();
    }
    if (this.retentionChartCanvas) {
      this.retentionChartCanvas.destroy();
    }
  }

  renderOfferChart() {
    if (this.offerChartCanvas) {
      this.offerChartCanvas.data.labels = this.offerLabels;
      this.offerChartCanvas.data.datasets[0].data = this.offerData;
      this.offerChartCanvas.data.datasets[0].label = this.offerLabels;
      this.offerChartCanvas.config.type = 'doughnut';
      this.offerChartCanvas.update();
    } else {
      this.offerChartCanvas = new Chart('offerChartCanvas', {
        type: 'doughnut',
        data: {
          labels: this.offerLabels,
          datasets: [
            {
              data: this.offerData,
              borderColor: ['rgba(255, 99, 132, .5)'],
              borderWidth: 1,
              hoverOffset: 4,
              backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                color: '#cecece',
                boxWidth: 10,
              },
            },
          },
        },
      });
    }
  }

  renderOnboardingChart() {
    if (this.onboardingChartCanvas) {
      this.onboardingChartCanvas.data.labels = this.onboardingLabels;
      this.onboardingChartCanvas.data.datasets[0].data = this.onboardingData;
      this.onboardingChartCanvas.data.datasets[0].label = this.onboardingLabels;
      this.onboardingChartCanvas.config.type = 'doughnut';
      this.onboardingChartCanvas.update();
    } else {
      this.onboardingChartCanvas = new Chart('onboardingChartCanvas', {
        type: 'doughnut',
        data: {
          labels: this.onboardingLabels,
          datasets: [
            {
              data: this.onboardingData,
              borderColor: ['rgba(255, 99, 132, .5)'],
              borderWidth: 1,
              hoverOffset: 4,
              backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                color: '#cecece',
                boxWidth: 10,
              },
            },
          },
        },
      });
    }
  }

  renderRetentionChart() {
    if (this.retentionChartCanvas) {
      this.retentionChartCanvas.data.labels = this.retentionLabels;
      this.retentionChartCanvas.data.datasets[0].data = this.retentionData;
      this.retentionChartCanvas.data.datasets[0].label = this.retentionLabels;
      this.retentionChartCanvas.config.type = 'doughnut';
      this.retentionChartCanvas.update();
    } else {
      this.retentionChartCanvas = new Chart('retentionChartCanvas', {
        type: 'doughnut',
        data: {
          labels: this.retentionLabels,
          datasets: [
            {
              data: this.retentionData,
              borderColor: ['rgba(255, 99, 132, .5)'],
              borderWidth: 1,
              hoverOffset: 4,
              backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                color: '#cecece',
                boxWidth: 10,
              },
            },
          },
        },
      });
    }
  }

  loadAllUsers(): Observable<any> {
    return this.employeeService.getAllEmployees().pipe(tap((data) => (this.employeeDataStore = data)));
  }

  filterEmployees() {
    this.filteredEmployees = this.employeeDataStore.filter(
      (emp: any) => emp.organizationId === this.organizationId
    );
    this.totalEvents = this.filteredEmployees.length; // Update totalEvents here
  }

  paginateEvents(pageIndex: number = 0, pageSize: number = this.pageSize): void {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.paginatedEvents.data = this.filteredEmployees.slice(startIndex, endIndex);
  }

  changePage(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.paginateEvents(event.pageIndex, event.pageSize);
  }

  createPlan(id: any) {
    if (id) {
      this.router.navigate(['/onboardin/plan'], { queryParams: { id: id } });
    }
  }
}
