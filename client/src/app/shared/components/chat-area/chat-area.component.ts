import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {ChatService} from "../../../services/chat.service";
import {SocketService} from "../../../services/socket.service";
import {finalize, Observable, Subject, Subscription, tap} from "rxjs";
import {MessageModel} from "../../data-models/Message.model";
import {EmployeesService} from "../../../services/employees.service";
import {SafeResourceUrl} from "@angular/platform-browser";
import {MultimediaService} from "../../../services/multimedia.service";
import {NGXLogger} from "ngx-logger";
import {AuthService} from "../../../services/auth.service";
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  @ViewChild('scroll', { read: ElementRef }) public scroll: ElementRef<any> | any;

  employeeDataStore: any;
  chatDataStore: any;
  sender: any;
  receiver: any;
  chat: any[] = [];
  senderId: any;
  receiverId: any;
  chatMessages: any[] = [];
  isMessageFromSender: boolean = false;

  message: string = '';
  messages: string[] = [];
  messageSubscription: Subscription | any;

  messageForm = new FormGroup({
    message: new FormControl('', [
      Validators.required,
      Validators.maxLength(2000)
    ])
  });

  private sectionSource = new Subject<string>();
  section$ = this.sectionSource.asObservable();

  selectedImage: File | any;
  uploadProgress = 0;
  imageUrl: any;
  progressBar:boolean = false;

  showEmojiPicker = false;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private socketService: SocketService,
    private multimediaService: MultimediaService,
    private cookieService: AuthService,
    private renderer: Renderer2,
    private storage: AngularFireStorage,
    private employeeService: EmployeesService,
    private logger: NGXLogger
  ) {}

  async ngOnInit(): Promise<any> {
    await this.loadAllUsers().subscribe(() => {
      this.loadSender();
      this.loadReceiver();
    });
    this.scrollBottom();
    this.socketService.connect();

    // Subscribe to incoming messages
    this.messageSubscription = this.socketService.onMessage().subscribe((message: string) => {
      this.handleIncomingMessage(message);
    });
  }

  ngAfterViewInit(): void {
    // Ensure connection status is logged
    this.socketService.getConnectionStatus().subscribe((status: boolean) => {
      console.log('WebSocket connection status:', status);
    });
  }

  ngAfterViewChecked() {
    this.scrollBottom();
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.socketService.disconnect();
  }

  loadAllUsers(): Observable<any> {
    return this.employeeService.getAllEmployees().pipe(
      tap(data => this.employeeDataStore = data)
    );
  }

  loadReceiver() {
    this.route.params.subscribe(params => {
      if (this.employeeDataStore) { // Check if employeesDataStore is populated
        const foundEmployee = this.employeeDataStore.find((emp: any) => emp.id === params['id']);
        if (foundEmployee) {
          this.receiver = [foundEmployee];
          this.receiverId = foundEmployee.id;
          this.loadChat().then(() => {
            //  implement what happen after chats are loaded
          })
        }
      }
    });
  }

  loadSender() {
    this.senderId = this.cookieService.userID().toString();
    if (this.employeeDataStore) { // Check if employeesDataStore is populated
      const foundEmployee = this.employeeDataStore.find((emp: any) => emp.id === this.senderId);
      if (foundEmployee) {
        this.sender = foundEmployee;
      }
    }
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
    let sender: boolean = false;

    // Sort messages by timestamp
    messages.sort((a: any, b: any) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    messages.forEach((message: any) => {
      if (message.userId === this.receiverId.toString()) {
        sender = false;
      } else if (message.userId === this.senderId.toString()) {
        sender = true;
      }
      this.chatMessages.push(message); // Push each message into chatMessages array
    });
    this.isMessageFromSender = sender;
  }

  handleIncomingMessage(message: string): void {
    try {
      const parsedMessage: MessageModel = JSON.parse(message);
      console.log(parsedMessage);

      if (parsedMessage && parsedMessage.chatId && this.receiverId && this.senderId) {
        const combinedId1 = this.receiverId.toString() + this.senderId.toString();
        const combinedId2 = this.senderId.toString() + this.receiverId.toString();

        if (parsedMessage.chatId === combinedId1 || parsedMessage.chatId === combinedId2) {
          this.chatMessages.push(parsedMessage);

          // Optionally, you can scroll to the bottom of the chat window to show the latest message
          this.scrollBottom();
        }
      } else {
        console.error('Invalid message format or missing IDs:', message);
      }
    } catch (e) {
      console.error('Failed to parse message as JSON:', message, e);
    }
  }

  isMessageFrom(message: any): boolean {
    return message.userId === this.senderId.toString();
  }

  sendMessage() {
    if (this.messageForm.valid) {
      const messageContent = this.messageForm.value.message;
      const message = {
        userId: this.senderId,
        chatId: this.receiverId + this.senderId,
        content: messageContent,
        timestamp: new Date().toISOString()
      };
      this.socketService.sendMessage(JSON.stringify(message));

      this.chatService.addMessage({
        id: null,
        userId: this.senderId,
        chatId: (this.receiverId + "") + (this.senderId + ""),
        content: messageContent,
        status: 'sent',
        timestamp: new Date()
      }).subscribe(() => {
        this.loadChat();
        this.messageForm.reset();
      }, error => {
        this.logger.error(error);
      });
    }
  }

  onEnterKey(event: any) {
    const key = event as KeyboardEvent;
    // Check if the Enter key is pressed and the Shift key is not pressed
    if (key.key === 'Enter' && !key.shiftKey) {
      // Prevent the default Enter key behavior (e.g., newline in textarea)
      key.preventDefault();
      // Call the sendMessage function
      this.sendMessage();
    }
  }

  convertToSafeUrl(url: any): SafeResourceUrl {
    return this.multimediaService.convertToSafeUrl(url, 'image/jpeg');
  }

  public scrollBottom() {
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
  }

  public scrollToTop() {
    this.scroll.nativeElement.scrollTop = 0;
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
    this.uploadImage(this.selectedImage);
  }

  uploadImage(file: File) {
    if (!file) return;

    this.progressBar = true;
    const filePath = `images/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    uploadTask.percentageChanges().subscribe((progress:any) => {
      this.uploadProgress = progress;
    });

    uploadTask.snapshotChanges().pipe(
      finalize(async () => {
        this.imageUrl = await fileRef.getDownloadURL().toPromise();
        this.addImageToMessage(this.imageUrl);
      })
    ).subscribe();
  }

  addImageToMessage(imageUrl: string) {
    const markdown: string = `![alt text](${imageUrl})`;
    const currentMessage = this.messageForm.value.message || '';
    this.messageForm.patchValue({message: currentMessage + markdown});
    this.progressBar = false;
  }

  insertEmoji(event:any) {
    const emoji = event.emoji.native;
    const currentMessage = this.messageForm.value.message || '';
    this.messageForm.patchValue({ message: currentMessage + emoji });
    this.showEmojiPicker = false; // Close the emoji picker after selection
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }
}
