import {Component, OnInit} from '@angular/core';
import {transferDataStore} from "../../../shared/data-stores/transfer-data-store";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-transfer-request',
  templateUrl: './transfer-request.component.html',
  styleUrls: ['./transfer-request.component.scss']
})
export class TransferRequestComponent implements OnInit{

  userId: any
  transferRequestsStore: any = transferDataStore;

  constructor(private route:ActivatedRoute) {
  }
  ngOnInit(): void {
    this.getUserId();
  }

  getUserId(){
    this.userId = localStorage.getItem('sender');
  }

}
