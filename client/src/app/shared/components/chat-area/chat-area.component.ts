import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {employeeDataStore} from "../../data-stores/employee-data-store";
import {ChatService} from "../../../services/chat.service";
import {Parser} from "@angular/compiler";

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit {

  employeeDataStore = employeeDataStore
  chatDataStore: any
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

  constructor(private route:ActivatedRoute, private chatService: ChatService) {
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
    this.chatService.getAllChats().subscribe(data => {
      data.forEach((chat:any) => {
        if (chat.id == (this.receiverId+"")+(this.senderId+"")) {
          this.chat = [chat];
          this.loadMessages(chat.messages)
        }
      })
    }, error => {
      console.log(error)
    })
  }

  loadMessages(messages: any) {
    let sender:boolean = false
    messages.forEach((message: any) => {
      if (message.userId === this.receiverId.toString()) {
        sender = false
      }
      else if (message.userId === this.senderId.toString()) {
        sender = true
      }
      this.chatMessages = [...this.chatMessages, message];
    })
    this.isMessageFromSender = sender
  }

  isMessageFrom(message: any): boolean {
    return message.userId === this.senderId.toString();
  }

  sendMessage() {
    if (this.messageForm.valid) {
      this.chatService.addMessage({
        id: null,
        userId: this.senderId,
        chatId: (this.receiverId+"")+(this.senderId+""),
        content: this.messageForm.value.message,
        status: 'sent',
        timestamp: new Date()
      }).subscribe(() => {
        this.loadChat()
        this.messageForm.reset()
      }, error => {
        console.log(error)
      })
    }
  }
}
