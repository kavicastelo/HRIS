import {Component, OnInit} from '@angular/core';
import {Observable, tap} from "rxjs";
import {SafeResourceUrl} from "@angular/platform-browser";
import {EmployeesService} from "../../../services/employees.service";
import {MultimediaService} from "../../../services/multimedia.service";
import {AuthService} from "../../../services/auth.service";
import {Chart, registerables} from "chart.js";
import _default from "chart.js/dist/plugins/plugin.legend";
import position = _default.defaults.position;

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-initial',
  templateUrl: './dashboard-initial.component.html',
  styleUrls: ['./dashboard-initial.component.scss']
})
export class DashboardInitialComponent implements OnInit {

  userId: any;
  loggedUserId: any;

  // test data for profile
  employeeDataStore: any;
  employee: any

  empLabels: any[] = ['Permanent', 'Contract', 'Trainees'];
  empData: any[] = [25, 50, 75];
  empChartCanvas: any;

  attendLabels: any[] = ['Present', 'Leave', 'Absent'];
  attendData: any[] = [95, 10, 5];
  attendChartCanvas: any;

  payrollLabels: any[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  payrollData1: any[] = [95, 10, 5, 8, 10, 15, 20, 25, 30, 35, 40, 55];
  payrollData2: any[] = [5, 10, 15, 20, 25, 30, 35, 40, 55, 30, 35, 40];
  payrollData3: any[] = [35, 40, 55, 30, 35, 40, 55, 30, 35, 40, 55, 30];
  payrollData4: any[] = [15, 20, 25, 35, 40, 55, 30, 35, 40, 55, 30, 35];
  payrollChartCanvas: any;

  pageSize: number = 5;
  currentPage: number = 0;

  constructor(
    private employeeService: EmployeesService,
    private multimediaService: MultimediaService,
    private cookieService: AuthService) {
  }

  async ngOnInit(): Promise<any> {
    this.loggedUserId = this.cookieService.userID().toString();

    await this.loadAllUsers().subscribe(() => {
      this.getUser();
    })

    this.renderEmpChart();
    this.renderAttendChart();
    this.renderPayrollChart();
  }

  loadAllUsers(): Observable<any> {
    return this.employeeService.getAllEmployees().pipe(
      tap(data => this.employeeDataStore = data)
    );
  }

  getUser() {
    this.userId = this.cookieService.userID().toString();
    return this.employee = this.employeeDataStore.find((emp: any) => emp.id === this.userId);
  }

  convertToSafeUrl(url: any): SafeResourceUrl {
    return this.multimediaService.convertToSafeUrl(url, 'image/jpeg')
  }

  renderEmpChart() {
    if (this.empChartCanvas) {
      this.empChartCanvas.data.labels = this.empLabels;
      this.empChartCanvas.data.datasets[0].data = this.empData;
      this.empChartCanvas.data.datasets[0].label = this.empLabels;
      this.empChartCanvas.config.type = 'doughnut';
      this.empChartCanvas.update();
    } else {
      this.empChartCanvas = new Chart("empChart", {
        type: 'doughnut',
        data: {
          labels: this.empLabels,
          datasets: [{
            data: this.empData,
            borderColor: [
              'rgba(255, 99, 132, .5)'
            ],
            borderWidth: 1,
            hoverOffset: 4,
            backgroundColor: [
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: '#cecece',
                boxWidth: 10
              }
            }
          }
        }
      });
    }
  }

  renderAttendChart() {
    if (this.attendChartCanvas) {
      this.attendChartCanvas.data.labels = this.attendLabels;
      this.attendChartCanvas.data.datasets[0].data = this.attendData;
      this.attendChartCanvas.data.datasets[0].label = this.attendLabels;
      this.attendChartCanvas.config.type = 'doughnut';
      this.attendChartCanvas.update();
    } else {
      this.attendChartCanvas = new Chart("attendChart", {
        type: 'doughnut',
        data: {
          labels: this.attendLabels,
          datasets: [{
            data: this.attendData,
            borderColor: [
              'rgba(255, 99, 132, .5)'
            ],
            borderWidth: 1,
            hoverOffset: 4,
            backgroundColor: [
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: '#cecece',
                boxWidth: 10
              }
            }
          }
        }
      });
    }
  }

  getPagedData() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return {
      labels: this.payrollLabels.slice(start, end),
      datasets: [
        {
          label: 'Basic Salary',
          data: this.payrollData1.slice(start, end),
          borderColor: 'rgba(54, 162, 235, 0.7)',
          borderWidth: 1,
          borderJoinStyle: 'round',
          backgroundColor: 'rgba(54, 162, 235, 0.7)'
        },
        {
          label: 'Overtime',
          data: this.payrollData2.slice(start, end),
          borderColor: 'rgba(255, 206, 86, 0.7)',
          borderWidth: 1,
          backgroundColor: 'rgba(255, 206, 86, 0.7)'
        },
        {
          label: 'Allowance',
          data: this.payrollData3.slice(start, end),
          borderColor: 'rgba(75, 192, 192, 0.7)',
          borderWidth: 1,
          backgroundColor: 'rgba(75, 192, 192, 0.7)'
        },
        {
          label: 'Others',
          data: this.payrollData4.slice(start, end),
          borderColor: 'rgba(153, 102, 255, 0.7)',
          borderWidth: 1,
          backgroundColor: 'rgba(153, 102, 255, 0.7)'
        }
      ]
    };
  }

  renderPayrollChart() {
    const pagedData:any = this.getPagedData();

    if (this.payrollChartCanvas) {
      this.payrollChartCanvas.data.labels = pagedData.labels;
      this.payrollChartCanvas.data.datasets = pagedData.datasets;
      this.payrollChartCanvas.update();
    } else {
      this.payrollChartCanvas = new Chart("payrollChart", {
        type: 'line',
        data: pagedData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              grid: { display: false },
              ticks: { color: '#cecece' }
            },
            x: {
              grid: { color: '#cecece', display: false },
              ticks: { color: '#cecece' }
            }
          },
          plugins: {
            colors: { enabled: true },
            legend: {
              display: true,
              position: 'top',
              labels: { color: '#cecece', boxWidth: 10 }
            }
          }
        }
      });
    }
  }

  nextPage() {
    if ((this.currentPage + 1) * this.pageSize < this.payrollLabels.length) {
      this.currentPage++;
      this.renderPayrollChart();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.renderPayrollChart();
    }
  }

}
