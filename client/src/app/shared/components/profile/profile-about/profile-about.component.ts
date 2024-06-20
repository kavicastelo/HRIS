import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ThemeService} from "../../../../services/theme.service";
import {NGXLogger} from "ngx-logger";
import {EmployeesService} from "../../../../services/employees.service";
import {Observable, tap} from "rxjs";
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-profile-about',
  templateUrl: './profile-about.component.html',
  styleUrls: ['./profile-about.component.scss']
})
export class ProfileAboutComponent implements OnInit {
  employeeDataStore: any;
  employee: any
  userId: any;

  isVisible: boolean = false; // edit button visibility

  constructor(private themeService: ThemeService,
              private employeeService: EmployeesService,
              private dialog: MatDialog,
              private router: Router,
              private route: ActivatedRoute,
              private cookieService: AuthService,
              private logger: NGXLogger) {
  }
  async ngOnInit(): Promise<any> {
    await this.loadAllUsers().subscribe(()=>{
      this.getUser();
      this.setEditButtonVisibility();
    })
  }

  loadAllUsers(): Observable<any>{
    return this.employeeService.getAllEmployees().pipe(
        tap(data => this.employeeDataStore = data)
    );
  }

  getUser() {
    this.employeeDataStore.forEach((emp:any) => {
      this.route.paramMap.subscribe(params => {
        this.userId = params.get('id');

        if (emp.id == this.userId) {
          this.employee = [emp];
        }
      }, error => {
        this.logger.error(error)
      })
    })
  }

  setEditButtonVisibility(){
    const id = this.cookieService.userID().toString();
    if(id === this.employee[0].id){
      this.isVisible = true;
    }
  }

  navigateBetweenTabs(path: string) {
    this.router.navigate([`/profile/${this.userId}/${path}/${this.userId}`]);
  }
}
