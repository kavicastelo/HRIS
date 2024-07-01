import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss']
})
export class ForbiddenComponent implements OnInit{
  userLevel: any

  constructor(private router: Router, private cookieService: AuthService) {
  }
  ngOnInit(): void {
    this.userLevel = this.cookieService.level()
    setTimeout(() => {
      this.goHome()
    }, 3000)
  }

  goHome() {
    if (this.userLevel == 0 || this.userLevel == 1) {
      this.router.navigate(['/dashboard']);
    }
    else {
      this.router.navigate(['/feed']);
    }
  }
}
