import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket$: WebSocketSubject<any> | any;

  constructor() { }

  public connect(url: string): void {
    this.socket$ = webSocket(url);
  }

  public sendMessage(message: any): void {
    this.socket$.next(message);
  }

  public onMessage(): Observable<any> {
    return this.socket$.asObservable();
  }

  public disconnect(): void {
    this.socket$.complete(); // Close the WebSocket connection
  }
}
