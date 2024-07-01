import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  userLevel:any
  constructor(private router: Router, private cookieService: AuthService) {
  }
  ngOnInit(): void {
    this.userLevel = this.cookieService.level()
    setTimeout(() => {
      this.goHome()
    }, 5000)
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
