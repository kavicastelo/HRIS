import {Component, OnInit} from '@angular/core';
import {CredentialsService} from "../../services/credentials.service";
import {Observable, tap} from "rxjs";


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  email: any;
  attempt = 4;
  errorMassage: string = '';
  credentialsDataStore: any;
  filteredCredential: any[] = [];

  constructor(private credentialsService: CredentialsService) {
  }

  async ngOnInit(): Promise<any> {
    this.getAllCredentials().subscribe(() => {
      this.filterCredentials()
    })
  }

  getAllCredentials(): Observable<any> {
    return this.credentialsService.getAllCredentials().pipe(
      tap(data => this.credentialsDataStore = data)
    )
  }

  filterCredentials() {
    return this.credentialsDataStore.filter((user: any) => user.email === this.email ? this.filteredCredential = user : null);
  }

  resetPassword() {
    if (this.email == null) {
      this.errorMassage = "Please enter your email.";
      return;
    } else {
      if (this.filterCredentials()[0] == undefined) {
        this.errorMassage = "Invalid email.";
        return;
      } else {
        if (this.attempt == 0 || sessionStorage.getItem('Rezty') == '0') {
          sessionStorage.setItem('Rezty', '0')
          this.errorMassage = "You have exceeded the maximum number of attempts. Please try again in 5 minutes.";

          setTimeout(() => {
            sessionStorage.removeItem('Rezty')
            this.errorMassage = '';
            this.attempt = 4;
          }, 1000 * 60 * 5);
          return;
        } else {
          this.attempt--;

          if (sessionStorage.getItem('Rezty') == '1') {
            sessionStorage.setItem('Rezty', '1')
            setTimeout(() => {
              this.errorMassage = 'Try again in 30 seconds.';
              sessionStorage.removeItem('Rezty')
            }, 1000 * 30);
            return;
          }

          this.credentialsService.resetPassword(this.filterCredentials()[0].id).subscribe(data => {
            this.email=''
            this.errorMassage = 'Check your email to reset your password.'
          })
        }
      }
    }
  }
}
