import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {employeeDataStore} from "../../data-stores/employee-data-store";
import {ChatService} from "../../../services/chat.service";
import {Parser} from "@angular/compiler";
import {WebSocketService} from "../../../services/web-socket.service";
import {Subscription} from "rxjs";
import {MessageModel} from "../../data-models/Message.model";

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit, OnDestroy {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef | any;

  employeeDataStore = employeeDataStore
  chatDataStore: any
  sender: any
  receiver: any
  chat: any[] = []
  senderId: any;
  receiverId: any
  chatMessages: any[] = []
  isMessageFromSender: boolean = false;

  message: string = '';
  messages: string[] = [];
  messageSubscription: Subscription | any;

  messageForm = new FormGroup({
    message: new FormControl(null, [
      Validators.required
    ])
  });

  constructor(private route:ActivatedRoute, private chatService: ChatService, private webSocketService: WebSocketService) {
  }

  ngOnInit(): void {
    localStorage.setItem('sender','1')
    this.senderId = localStorage.getItem('sender')
    this.loadReceiver()
    this.loadSender()

    try {
      // Establish WebSocket connection
      // this.webSocketService.connect('ws://localhost:4200/ws');

      // this.webSocketService.getConnectionStatus().subscribe((status: boolean) => {
      //   console.log('WebSocket connection status:', status);
      // });

      // Subscribe to incoming messages
      this.messageSubscription = this.webSocketService.onMessage().subscribe((message: string) => {
        console.log('Received message:', message);
        this.handleIncomingMessage(message);
      });
    }
    catch (e) {
      console.log(e);
    }
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    // this.webSocketService.disconnect();
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

  async loadChat() {
    this.chatMessages = [];
    this.chat = [];
    const data = await this.chatService.getAllChats().toPromise();
    for (const chat of data) {
      if (chat.id === `${this.receiverId}${this.senderId}` || chat.id === `${this.senderId}${this.receiverId}`) {
        this.chat.push(...chat.messages); // Concatenate messages from both chats
      }
    }
    this.loadMessages(this.chat); // Pass concatenated messages to loadMessages
  }

  loadMessages(messages: any) {
    let sender:boolean = false

    // Sort messages by timestamp
    messages.sort((a: any, b: any) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    messages.forEach((message: any) => {
      if (message.userId === this.receiverId.toString()) {
        sender = false
      }
      else if (message.userId === this.senderId.toString()) {
        sender = true
      }
      this.chatMessages.push(message); // Push each message into chatMessages array
    })
    this.isMessageFromSender = sender
  }

  handleIncomingMessage(message: string): void {
    const parsedMessage: MessageModel = JSON.parse(message);
    console.log(message)
    if (parsedMessage.chatId === (this.receiverId + this.senderId) || parsedMessage.chatId === (this.senderId + this.receiverId)) {
      this.chatMessages.push(parsedMessage);

      // Optionally, you can scroll to the bottom of the chat window to show the latest message
      this.scrollToBottom();
    }
  }

  isMessageFrom(message: any): boolean {
    return message.userId === this.senderId.toString();
  }

  sendMessage() {
    this.webSocketService.sendMessage(this.messageForm.value.message);

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

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
