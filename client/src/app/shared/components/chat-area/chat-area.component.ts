import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {employeeDataStore} from "../../data-stores/employee-data-store";

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit {

  isDisabled = true;
  employeeDataStore = employeeDataStore
  receiver: any

  messageForm = new FormGroup({
    message: new FormControl(null, [
      Validators.required
    ])
  });

  constructor(private route:ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loadReceiver()
  }

  loadReceiver() {
    this.route.params.subscribe(params => {
      employeeDataStore.forEach(emp => {
        if (emp.id == params['id']) {
          this.receiver = [emp];
        }
      })
    })
  }

  sendMessage() {
  }
}
