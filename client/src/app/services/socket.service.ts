import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;
  private messageSubject = new Subject<string>();
  private connectionStatusSubject = new Subject<boolean>();

  constructor() {}

  connect(): void {
    this.socket = io('http://localhost:3000', { transports: ['websocket'] });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.connectionStatusSubject.next(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      this.connectionStatusSubject.next(false);
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('WebSocket connection error:', error);
      this.connectionStatusSubject.next(false);
    });

    this.socket.on('message', (message: string) => {
      this.messageSubject.next(message);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.connectionStatusSubject.next(false);
    }
  }

  sendMessage(message: string): void {
    if (this.socket) {
      this.socket.emit('message', message);
    }
  }

  onMessage(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatusSubject.asObservable();
  }
}
