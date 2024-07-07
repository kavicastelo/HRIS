import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { authDataStore } from "../../shared/data-stores/auth-data-store";
import {CredentialsService} from "../../services/credentials.service";
import {AuthService} from "../../services/auth.service";
import {Observable, tap} from "rxjs";
import {EmployeesService} from "../../services/employees.service";
import {EncryptionService} from "../../services/encryption.service";

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
  filteredCredential:any[] = [];

  constructor(private router: Router,
              private credentialsService: CredentialsService,
              private cookieService: AuthService,
              private encryptionService: EncryptionService,
              private employeeService: EmployeesService) { }

  async ngOnInit(): Promise<any> {
    this.getAllCredentials().subscribe(()=>{
      this.filterCredentials()
    })
  }

  getAllCredentials(): Observable<any>{
    return this.credentialsService.getAllCredentials().pipe(
        tap(data => this.credentialsDataStore = data)
    )
  }

  filterCredentials() {
    return this.credentialsDataStore.filter((user:any) => user.email === this.email? this.filteredCredential = user : null);
  }

  login() {
    const password = this.encryptionService.encryptPassword(this.password.toString());
    let foundUser = this.filterCredentials()[0];
    const encryptedPassword = this.encryptionService.decryptPassword(foundUser.password.toString());
    console.log(password, encryptedPassword)

    if (foundUser) {
      if (this.password.toString() !== encryptedPassword) {
        this.errorMassage='Invalid password';
        return
      } else {
        this.employeeService.getEmployeeByEmail(foundUser.email).subscribe((data:any)=>{
          this.cookieService.createUserID(data.id);
          this.cookieService.createOrganizationID(data.organizationId);
          this.cookieService.createDepartmentID(data.departmentId);
          this.cookieService.createLevel(data.level);

          if (data.level == '0' || data.level == '1') {
            this.router.navigate(['/dashboard']).then(()=>{
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
      }
    } else {
      this.errorMassage='Invalid username';
    }
  }

}



