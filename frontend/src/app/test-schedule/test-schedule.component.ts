import { Component, OnInit } from '@angular/core';
import { ScheduleEvent } from '../models/schedule event';
import { Team } from '../models/team/team.model';
import { ScheduleEventService } from '../services/schedule-event/schedule-event.service';
import { AuthService } from '../services/auth/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-test-schedule',
  templateUrl: './test-schedule.component.html',
  styleUrl: './test-schedule.component.scss'
})
export class TestScheduleComponent implements OnInit {
  currentView: 'day' | 'week' | 'month' = 'month';
  currentDate: Date = new Date();
  today: Date = new Date();
  events: ScheduleEvent[] = [];
  teams: Team[] = [];
  newEvent: ScheduleEvent = {
    scheduleEventName: '',
    eventDescription: '',
    scheduleEventDate: new Date(),
    eventTimeStart: '',
    eventTimeEnd: '',
    teamId: '',
    userId: ''
  };
  selectedEvent: ScheduleEvent | null = null;
  hours: string[] = [];

  // Variables to control modal visibility
  createEventModalVisible: boolean = false;
  viewEventDetailsModalVisible: boolean = false;
  editEventModalVisible: boolean = false;

  constructor(
    private eventService: ScheduleEventService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.initializeHours();
  }

  ngOnInit(): void {
    this.loadEvents();
    this.loadTeams();
  }
  initializeHours(): void {
    for (let i = 0; i < 24; i++) {
      const hour = i < 10 ? `0${i}:00` : `${i}:00`;
      this.hours.push(hour);
      const halfHour = i < 10 ? `0${i}:30` : `${i}:30`;
      this.hours.push(halfHour);
    }
  }

  prev(): void {
    if (this.currentView === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    } else if (this.currentView === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() - 7);
    } else if (this.currentView === 'day') {
      this.currentDate.setDate(this.currentDate.getDate() - 1);
    }
    this.currentDate = new Date(this.currentDate);
  }
  
  next(): void {
    if (this.currentView === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    } else if (this.currentView === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
    } else if (this.currentView === 'day') {
      this.currentDate.setDate(this.currentDate.getDate() + 1);
    }
    this.currentDate = new Date(this.currentDate);
  }
  
  resetToToday(): void {
    this.currentDate = new Date();
  }

  getDaysInMonth(): { date: Date, day: number | null }[] {
    const days: { date: Date, day: number | null }[] = [];
    const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const firstDayIndex = date.getDay();
    
    // Previous month empty days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ date: new Date(date.getFullYear(), date.getMonth(), date.getDate() - firstDayIndex + i), day: null });
    }
  
    // Current month days
    while (date.getMonth() === this.currentDate.getMonth()) {
      days.push({ date: new Date(date), day: date.getDate() });
      date.setDate(date.getDate() + 1);
    }
  
    return days;
  }
  
  getDaysInWeek(startDate: Date): { date: Date, dayName: string }[] {
    const days: { date: Date, dayName: string }[] = [];
    const date = new Date(startDate);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      days.push({ date: new Date(date), dayName: dayNames[date.getDay()] });
      date.setDate(date.getDate() + 1);
    }
    
    return days;
  }
  
  getDayTimes(): { time: string }[] {
    return this.hours.map(hour => ({ time: hour }));
  }

  isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString();
  }

  isSameDate(date1: Date | string, date2: Date): boolean {
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    return d1.toDateString() === date2.toDateString();
  }

  isSameTime(eventTime: string | undefined, timeSlot: string): boolean {
    if (!eventTime || !timeSlot) return false;
    const [eventHour, eventMinute] = eventTime.split(':');
    const [slotHour, slotMinute] = timeSlot.split(':');
    return eventHour === slotHour && eventMinute === slotMinute;
  }
  
  onDateChange(newDate: string): void {
    if (this.selectedEvent) {
      this.selectedEvent.scheduleEventDate = new Date(newDate);
    }
  }
  
  formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
  
  
  loadEvents() {
    this.eventService.getEventsForUser().subscribe(
      (events: ScheduleEvent[]) => {
        console.log('API response:', events);
        this.events = events;
      },
      (error) => {
        console.error('Error loading events:', error);
        this.events = [];
      }
    );
  }

  loadTeams(): void {
    this.eventService.getAllTeams().subscribe({
      next: data => {
        this.teams = data;
      },
      error: error => {
        console.error('Failed to load teams:', error);
      }
    });
  }

  getTeamName(teamId: string | undefined): string {
    if (!teamId) {
      return 'Unknown Team';
    }
    const team = this.teams.find(t => t.teamId === teamId);
    return team ? team.teamName : 'Unknown Team';
  }
  
  changeView(view: 'day' | 'week' | 'month'): void {
    this.currentView = view;
  }

  onDateClick(date: Date): void {
    date.setHours(0, 0, 0, 0); // Reset the time part to midnight
    this.newEvent.scheduleEventDate = date;
    this.showCreateEventModal();
  }

  onTimeClick(date: Date, time: string): void {
    const [hours, minutes] = time.split(':');
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    this.newEvent.scheduleEventDate = date;
    this.newEvent.eventTimeStart = this.formatTimeToTimeSpan(hours, minutes);
    this.newEvent.eventTimeEnd = this.formatTimeToTimeSpan(hours, minutes);
    this.showCreateEventModal();
  }

  onEventClick(event: ScheduleEvent): void {
    this.selectedEvent = {
      ...event,
      scheduleEventDate: new Date(event.scheduleEventDate),
      eventTimeStart: this.formatTimeForInput(event.eventTimeStart),
      eventTimeEnd: this.formatTimeForInput(event.eventTimeEnd)
    };
    this.showViewEventDetailsModal();
  }

  showCreateEventModal(): void {
    this.createEventModalVisible = true;
  }

  hideCreateEventModal(): void {
    this.createEventModalVisible = false;
  }

  showViewEventDetailsModal(): void {
    this.viewEventDetailsModalVisible = true;
  }

  hideViewEventDetailsModal(): void {
    this.viewEventDetailsModalVisible = false;
  }

  showEditEventModal(): void {
    this.editEventModalVisible = true;
  }

  hideEditEventModal(): void {
    this.editEventModalVisible = false;
  }

  createEvent(): void {
    this.confirmationService.confirm({
      header: 'Confirm Save',
      message: 'Do you want to save the changes?',
      accept: () => {
        this.newEvent.userId = this.authService.getCurrentUserId() ?? '';

        const formattedEvent = this.formatEventForBackend(this.newEvent);
        console.log('Creating event with data:', formattedEvent);

        this.eventService.createScheduleEvent(formattedEvent).subscribe({
          next: (data) => {
            this.events.push(data);
            this.hideCreateEventModal();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Event created successfully', key: 'bc' });
            this.resetNewEvent();
          },
          error: (error) => {
            console.error('Failed to create event:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create event', key: 'bc' });
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Notification creation cancelled', key: 'bc' });
      }
    });
  }
  openUpdateModal(): void {
    this.viewEventDetailsModalVisible = false;
    this.editEventModalVisible = true;
  }
  
  onTimeSlotClick(date: Date, time: string): void {
    this.onTimeClick(date, time);
  }
  
  updateEvent(): void {
    if (this.selectedEvent) {
      const formattedEvent = this.formatEventForBackend(this.selectedEvent);
      
      this.eventService.updateScheduleEvent(this.selectedEvent.scheduleEventId!, formattedEvent).subscribe({
        next: (data) => {
          const index = this.events.findIndex(event => event.scheduleEventId === this.selectedEvent!.scheduleEventId);
          if (index !== -1) {
            this.events[index] = data;
          }
          this.hideEditEventModal();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Event updated successfully' });
        },
        error: (error) => {
          console.error('Failed to update event:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update event' });
        }
      });
    }
  }
  

  // Method to reset new event form
  resetNewEvent(): void {
    this.newEvent = {
      scheduleEventName: '',
      eventDescription: '',
      scheduleEventDate: new Date(),
      eventTimeStart: '',
      eventTimeEnd: '',
      teamId: '',
      userId: ''
    };
  }

  formatEventForBackend(event: ScheduleEvent): any {
    const adjustedDate = new Date(event.scheduleEventDate);
    adjustedDate.setMinutes(adjustedDate.getMinutes() - adjustedDate.getTimezoneOffset());

    return {
      ...event,
      scheduleEventDate: adjustedDate.toISOString().split('T')[0],
      eventTimeStart: this.formatTimeToTimeSpanFromString(event.eventTimeStart),
      eventTimeEnd: this.formatTimeToTimeSpanFromString(event.eventTimeEnd)
    };
  }

  formatTimeToTimeSpan(hours: string, minutes: string): string {
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  }

  formatTimeToTimeSpanFromString(time: string): string {
    const [hours, minutes] = time.split(':');
    return this.formatTimeToTimeSpan(hours, minutes);
  }

  formatTimeForInput(timeSpan: string): string {
    if (!timeSpan) return '';
    const formattedTime = timeSpan.substring(0, 8);
    return formattedTime;
  }

  deleteEvent(scheduleEventId: string | undefined): void {
    if (!scheduleEventId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid event ID' });
      return;
    }
  
    this.confirmationService.confirm({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this event?',
      accept: () => {
        this.eventService.deleteScheduleEvent(scheduleEventId).subscribe({
          next: () => {
            this.events = this.events.filter(event => event.scheduleEventId !== scheduleEventId);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Event deleted successfully' });
          },
          error: (error) => {
            console.error('Failed to delete event:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete event' });
          }
        });
      }
    });
  }
  
  
}
