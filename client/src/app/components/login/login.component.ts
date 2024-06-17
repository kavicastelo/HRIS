import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { authDataStore } from "../../shared/data-stores/auth-data-store";
import {CredentialsService} from "../../services/credentials.service";
import {AuthService} from "../../services/auth.service";
import {Observable, tap} from "rxjs";
import {EmployeesService} from "../../services/employees.service";

@Component({
  selector: 'app-log-in',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LogInComponent implements OnInit{
  email: string='';
  password: string='';
  errorMassage:string='';
  credentialsDataStore:any;

  constructor(private router: Router, private credentialsService: CredentialsService, private cookieService: AuthService, private employeeService: EmployeesService) { }

  async ngOnInit(): Promise<any> {
    this.getAllCredentials().subscribe(()=>{

    })
  }

  getAllCredentials(): Observable<any>{
    return this.credentialsService.getAllCredentials().pipe(
        tap(data => this.credentialsDataStore = data)
    )
  }

  login() {
    const foundUser = this.credentialsDataStore.find((user:any) => user.email === this.email && user.password === this.password);
    if (foundUser) {
      this.employeeService.getEmployeeByEmail(foundUser.email).subscribe((data:any)=>{
        this.cookieService.createUserID(data.id);
        this.cookieService.createOrganizationID(data.organizationId);
        this.cookieService.createDepartmentID(data.departmentId);
        this.cookieService.createLevel(data.level);

        if (data.level == '0' || data.level == '1') {
          this.router.navigate(['/employee']).then(()=>{
            location.reload()
          })
        }
        else{
          this.router.navigate(['/feed']).then(()=>{
            location.reload()
          });
        }
      }, error => {
        console.log(error)
      })
    } else {
      this.errorMassage='Invalid username or password';
    }
  }

}



