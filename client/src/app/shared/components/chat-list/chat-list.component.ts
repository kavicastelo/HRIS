import {Component, OnDestroy, OnInit} from '@angular/core';
import {employeeDataStore} from "../../data-stores/employee-data-store";
import {channelsDataStore} from "../../data-stores/channels-data-store";
import {MultimediaService} from "../../../services/multimedia.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ChatService} from "../../../services/chat.service";
import {WebSocketService} from "../../../services/web-socket.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit, OnDestroy {

  employeeDataStore = employeeDataStore;
  channelsDataStore = channelsDataStore;
  chatsDataStore: any
  senderId: any;
  receiverId: any
  isOpen = false

  availableChats: any[] = [];

  message: string = '';
  messages: string[] = [];
  messageSubscription: Subscription | any;

  constructor(private multimediaService: MultimediaService, private router: Router, private chatService: ChatService, private route: ActivatedRoute, private webSocketService: WebSocketService) {
  }
  ngOnInit(): void {
    localStorage.setItem('sender','1')
    this.senderId = localStorage.getItem('sender')
    this.loadChats()
    // convert base64 images to safe urls
    // this.employeeDataStore.forEach(emp => {
    //   emp.photo = this.multimediaService.convertToSafeUrl(emp.photo, 'image/jpeg');
    // })
    try {
      // Establish WebSocket connection
      // this.webSocketService.connect('ws://localhost:4200/ws');

      // Subscribe to incoming messages
      this.messageSubscription = this.webSocketService.onMessage().subscribe((message: string) => {
        this.messages.push(message);
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
  }

  navigateUrl(id: any) {
    this.receiverId = id
    this.availableChats = [];
    this.router.navigate([`/feed/chat/${id}`]);
    this.loadChats()

    this.webSocketService.getConnectionStatus().subscribe((status: boolean) => {
      console.log('WebSocket connection status:', status);
    }, (error: any) => {
      console.error('WebSocket connection error:', error);
    });
  }

  loadChats() {
    this.chatService.getAllChats().subscribe(chats => {
      this.chatsDataStore = chats;

      employeeDataStore.forEach((emp) => {
        this.chatsDataStore.forEach((chats:any) => {
          if (chats.id == (this.senderId.toString()+emp.id.toString())) {
            let lastMessage = chats.messages.pop();
            this.availableChats.push({
              id: emp.id,
              photo: emp.photo,
              name: emp.name,
              chatId: chats.id,
              messageSenderId: lastMessage.userId,
              status: lastMessage.status,
              lastMessage: lastMessage.content,
              lastMessageId: lastMessage.id
            });
          }
          this.changeStatus(chats.id)
        })
      })
    });
  }

  changeStatus(id: any) {
    this.availableChats.forEach((chat) => {
      if (chat)
        this.isOpen = (chat.messageSenderId !== this.senderId.toString() && chat.status == 'sent');
    })
    this.setStatus(id)
  }

  setStatus(chatId: any) {
    this.availableChats.forEach((chat) => {
      if(this.receiverId == chat.id && chat.chatId == chatId) {
        this.chatService.updateStatus(chat.lastMessageId, 'read', chat.chatId).subscribe(data => {
          this.isOpen = false
        }, error => {
          console.log(error)
        })
      }
    })
  }
}
