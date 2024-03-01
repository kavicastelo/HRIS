import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { authDataStore } from "../../shared/data-stores/auth-data-store";

@Component({
  selector: 'app-log-in',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LogInComponent {
  email: string='';
  password: string='';
 
 
  
  constructor(private router: Router) { }

login() {
  const foundUser = authDataStore.find(user => user.email === this.email && user.password === this.password);
  if (foundUser) {
    alert('Login successful!');
    this.router.navigate(['/home']);
  } else {
    alert('Invalid username or password');
  }
}


}
