import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {isSameDay, isSameMonth} from "date-fns";
import {EventService} from "../../../services/event.service";
import {EventDialogComponent} from "../../dialogs/event-dialog/event-dialog.component";

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss']
})
export class EventCalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  refresh: Subject<any> = new Subject();

  constructor(private eventService: EventService, public dialog: MatDialog) {}

  ngOnInit() {
    this.fetchEvents();
  }

  fetchEvents() {
    this.eventService.getEvents().subscribe(data => {
      this.events = data.map((event: any) => {
        return {
          title: event.title,
          start: new Date(event.start),
          end: event.end ? new Date(event.end) : null,
          allDay: event.allDay
        };
      });
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventClicked(event: CalendarEvent): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '250px',
      data: { event }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventService.saveEvent(result).subscribe(() => {
          this.fetchEvents();
        });
      }
    });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  addEvent(): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '250px',
      data: { event: { title: '', start: new Date(), end: new Date(), allDay: false } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventService.saveEvent(result).subscribe(() => {
          this.fetchEvents();
        });
      }
    });
  }
}
