import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | undefined;
  private messageSubject: Subject<string> = new Subject<string>();

  constructor() { }

  connect(): void {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    this.socket.on('message', (message: string) => {
      this.messageSubject.next(message);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  sendMessage(message: any): void {
    if (this.socket) {
      this.socket.emit('message', message);
    }
  }

  onMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }
}
