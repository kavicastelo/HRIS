import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import {CalendarEvent} from "angular-calendar";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getEvents(): Observable<any> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}event/get/all`);
  }

  saveEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(`${this.apiUrl}event/save`, event);
  }

  updateEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.put<CalendarEvent>(`${this.apiUrl}event/update/${event.id}`, event);
  }

  deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}event/delete/${eventId}`);
  }

  getHolidays(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}holiday/get/all`);
  }

  saveHoliday(holiday: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}holiday/save`, holiday);
  }

  updateHoliday(holiday: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}holiday/update/${holiday.id}`, holiday);
  }

  deleteHoliday(holidayId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}holiday/delete/${holidayId}`);
  }
}
