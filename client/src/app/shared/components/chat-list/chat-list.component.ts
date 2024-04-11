import {Component, OnDestroy, OnInit} from '@angular/core';
import {channelsDataStore} from "../../data-stores/channels-data-store";
import {MultimediaService} from "../../../services/multimedia.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ChatService} from "../../../services/chat.service";
import {WebSocketService} from "../../../services/web-socket.service";
import {Observable, Subscription, tap} from "rxjs";
import {EmployeesService} from "../../../services/employees.service";
import {SafeResourceUrl} from "@angular/platform-browser";
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit, OnDestroy {

  employeeDataStore: any[]=[];
  channelsDataStore = channelsDataStore;
  chatsDataStore: any
  senderId: any;
  receiverId: any
  isOpen = false

  employee:any = {
    name:''
  }

  availableChats: any[] = [];

  message: string = '';
  messages: string[] = [];
  messageSubscription: Subscription | any;

  constructor(private multimediaService: MultimediaService,
              private employeeService: EmployeesService,
              private router: Router,
              private chatService: ChatService,
              private route: ActivatedRoute,
              private webSocketService: WebSocketService, private logger: NGXLogger) {
  }
  async ngOnInit(): Promise<any> {
    this.loadAllUsers().subscribe(()=>{
      this.getUser()
      this.loadChats()
    })

    try {
      // Subscribe to incoming messages
      this.messageSubscription = this.webSocketService.onMessage().subscribe((message: string) => {
        this.messages.push(message);
      });
    }
    catch (e) {
      this.logger.error(e);
    }
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  loadAllUsers(): Observable<any>{
    return this.employeeService.getAllEmployees().pipe(
        tap(data => this.employeeDataStore = data)
    );
  }

  getUser() {
    this.senderId = localStorage.getItem('sender');
    if (this.employeeDataStore) { // Check if employeesDataStore is populated
      const foundEmployee = this.employeeDataStore.find((emp: any) => emp.id === this.senderId);
      if (foundEmployee) {
        this.employee = foundEmployee;
      }
    }
  }

  convertToSafeUrl(url:any):SafeResourceUrl{
    return this.multimediaService.convertToSafeUrl(url,'image/jpeg')
  }

  navigateUrl(id: any) {
    this.receiverId = id
    this.availableChats = [];

    this.router.navigate([`/feed/chat/${id}`]).then(r => {
      this.loadChats();
    });

    this.webSocketService.getConnectionStatus().subscribe((status: boolean) => {
      console.log('WebSocket connection status:', status);
    }, (error: any) => {
      console.error('WebSocket connection error:', error);
    });
  }

  loadChats() {
    this.chatService.getAllChats().subscribe(chats => {
      this.chatsDataStore = chats;

      this.employeeDataStore.forEach((emp:any) => {
        this.chatsDataStore.forEach((chats:any) => {
          if (chats.id == (this.senderId.toString()+emp.id) || chats.id == (emp.id+this.senderId.toString())) {
            let lastMessage = chats.messages.pop();
            let time = new Date(lastMessage.timestamp).getTime(); // Assuming timestamp is the property indicating the time of the message
            this.availableChats.push({
              id: emp.id,
              photo: this.multimediaService.convertToSafeUrl(emp.photo, 'image/jpeg'),
              name: emp.name,
              chatId: chats.id,
              messageSenderId: lastMessage.userId,
              status: lastMessage.status,
              lastMessage: lastMessage.content,
              lastMessageId: lastMessage.id,
              time: time // Add the time property
            });
          }
          this.setStatus(chats.id);
          chats.status = 'read'
        })
      })

      // Sort availableChats based on time property in descending order
      this.availableChats.sort((a: any, b: any) => {
        return b.time - a.time;
      });

      this.availableChats = this.removeDuplicates(this.availableChats, 'id');

    }, error => {
      this.logger.error(error)
    });
  }

  removeDuplicates(array: any[], key: string): any[] {
    const seen = new Set();
    return array.filter((item) => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }

  setStatus(chatId: any) {
    this.availableChats.forEach((chat) => {
      if(this.receiverId == chat.id && chat.chatId == chatId && chat.status == 'sent') {
        this.chatService.updateStatus(chat.lastMessageId, 'read', chat.chatId).subscribe(data => {
          chat.status = 'read';
        }, error => {
          console.log(error)
        })
      }
    })
  }
}
