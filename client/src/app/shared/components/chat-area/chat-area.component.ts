import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {employeeDataStore} from "../../data-stores/employee-data-store";
import {messageDataStore} from "../../data-stores/message-data-store";
import {chatDataStore} from "../../data-stores/chat-data-store";

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit {

  isDisabled = true;
  employeeDataStore = employeeDataStore
  messagesDataStore = messageDataStore
  chatDataStore = chatDataStore
  sender: any
  receiver: any
  chat: any
  senderId: any = 3
  receiverId: any
  chatMessages: any[] = []
  isMessageFromSender: boolean = false;

  messageForm = new FormGroup({
    message: new FormControl(null, [
      Validators.required
    ])
  });

  constructor(private route:ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loadReceiver()
    this.loadSender()
  }

  loadReceiver() {
    this.route.params.subscribe(params => {
      employeeDataStore.forEach(emp => {
        if (emp.id == params['id']) {
          this.receiver = [emp];
          this.receiverId = this.receiver[0].id
          this.loadChat()
        }
      })
    })
  }

  loadSender() {
    this.employeeDataStore.forEach(emp => {
      if (emp.id == this.senderId) {
        this.sender = [emp];
      }
    })
  }

  loadChat() {
    this.chatMessages = []
    this.chatDataStore.forEach(chat => {
      if (chat.id == (this.receiverId+"")+(this.senderId+"")) {
        this.chat = [chat];
        this.loadMessages(chat.messages)
      }
    })
  }

  loadMessages(messages: any) {
    let sender:boolean = false
    messages.forEach((message: any) => {
      if (message.userId == this.receiverId) {
        sender = false
      }
      else if (message.userId == this.senderId) {
        sender = true
      }
      this.chatMessages = [...this.chatMessages, message];
    })
    this.isMessageFromSender = sender
  }

  isMessageFrom(message: any): boolean {
    return message.userId === this.senderId;
  }

  sendMessage() {
  }
}
