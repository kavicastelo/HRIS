import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private websocket: WebSocket | null = null;
  private connectionStatusSubject: Subject<boolean> = new Subject<boolean>();
  private messageSubject: Subject<any> = new Subject<any>();

  connect(url: string): void {
    this.websocket = new WebSocket(url);

    this.websocket.onopen = (event: Event) => {
      this.connectionStatusSubject.next(true);
    };

    this.websocket.onmessage = (event: MessageEvent) => {
      this.messageSubject.next(event.data);
    };

    this.websocket.onclose = (event: CloseEvent) => {
      this.connectionStatusSubject.next(false);
    };

    this.websocket.onerror = (error: Event) => {
      console.error('WebSocket error observed:', error);
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

  sendMessage(message: any): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(message);
    }
  }

  onMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }
}
