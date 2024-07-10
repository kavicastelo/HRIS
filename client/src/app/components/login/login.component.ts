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
  attempts = 4;
  disabled: boolean = false;

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
    this.attempts --;
    const password = this.encryptionService.encryptPassword(this.password.toString());
    let foundUser = this.filterCredentials()[0];
    const encryptedPassword = this.encryptionService.decryptPassword(foundUser.password.toString());

    if (this.attempts <= 0 || sessionStorage.getItem('LgnAtT') == '0'){
      sessionStorage.setItem('LgnAtT', '0');
      this.errorMassage='Too many attempts! Try again in 5 minutes';
      this.email = '';
      this.password = '';
      this.disabled = true;
      setTimeout(()=>{
        this.errorMassage='';
        this.attempts = 4;
        sessionStorage.removeItem('LgnAtT');
        this.disabled = false;
      }, 1000 * 60 * 5);
      return;
    }

    if (foundUser && sessionStorage.getItem('LgnAtT') != '0') {
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



