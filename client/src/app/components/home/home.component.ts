import {Component, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private logger: NGXLogger) {
    this.logger.debug('HomeComponent initialized');
    // this.logger.info('This is an info message');
    // this.logger.error('This is an error message');
  }
  ngOnInit(): void {
  }

}
