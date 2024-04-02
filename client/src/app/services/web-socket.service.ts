import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket$: WebSocketSubject<any> | any;
  private websocket: WebSocket | any;
  private connectionStatusSubject: Subject<boolean> = new Subject<boolean>();
  private messageSubject: Subject<any> = new Subject<any>();

  constructor() { }

  connect(url: string): void {
    this.websocket = new WebSocket(url);

    this.websocket.onmessage = (event:any) => {
      this.messageSubject.next(event.data);
    };

    this.websocket.onopen = (event:any) => {
      this.connectionStatusSubject.next(true);
    };

    this.websocket.onclose = (event:any) => {
      this.connectionStatusSubject.next(false);
    };

    this.websocket.onerror = (error:any) => {
      this.connectionStatusSubject.next(false);
    };
  }

  disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
    }
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatusSubject.asObservable();
  }

  public sendMessage(message: any): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(message);
    }
  }

  onMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }
}
