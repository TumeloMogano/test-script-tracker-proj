import { Component, OnInit, ElementRef } from '@angular/core';
import { ScheduleEvent } from '../../models/schedule event';
import { ScheduleEventService } from '../../services/schedule-event/schedule-event.service';
import { Team } from '../../models/team/team.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
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

  constructor(private eventService: ScheduleEventService, private elementRef: ElementRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,private authService: AuthService
  ) {
    this.initializeHours();
  }

  ngOnInit(): void {
    this.loadEvents();
    this.loadTeams();
    this.scrollToCurrentTime();
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

  changeView(view: 'day' | 'week' | 'month'): void {
    this.currentView = view;
    this.scrollToCurrentTime();
  }

  //fixing the error of the date clicked 
  onDateClick(date: Date): void {
    date.setHours(0, 0, 0, 0); // Reset the time part to midnight
    this.newEvent.scheduleEventDate = date;
    document.getElementById('createEventModal')!.style.display = 'block';
  }
  
  onTimeClick(date: Date, time: string): void {
    const [hours, minutes] = time.split(':');
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    this.newEvent.scheduleEventDate = date;
    this.newEvent.eventTimeStart = this.formatTimeToTimeSpan(hours, minutes);
    this.newEvent.eventTimeEnd = this.formatTimeToTimeSpan(hours, minutes);
    document.getElementById('createEventModal')!.style.display = 'block';
  }

  onTimeSlotClick(date: Date, time: string): void {
    const [hours, minutes] = time.split(':');
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    this.newEvent.scheduleEventDate = date;
    this.newEvent.eventTimeStart = this.formatTimeToTimeSpan(hours, minutes);
    this.newEvent.eventTimeEnd = this.formatTimeToTimeSpan(hours, minutes);
    document.getElementById('createEventModal')!.style.display = 'block';
  }
  openUpdateModal(): void {
    document.getElementById('viewEventDetailsModal')!.style.display = 'none';
    // document.getElementById('createEventModal')!.style.display = 'block';
    document.getElementById('editEventModal')!.style.display = 'block'; 
  }
  //ensuring that by clicking on event it shows all details 
  formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
  
  // Method to handle date changes
  onDateChange(newDate: string): void {
    this.selectedEvent!.scheduleEventDate = new Date(newDate);
  }

  onEventClick(event: ScheduleEvent): void {
    
    this.selectedEvent = {
      ...event,
      scheduleEventDate: new Date(event.scheduleEventDate),
      eventTimeStart: this.formatTimeForInput(event.eventTimeStart), 
      eventTimeEnd: this.formatTimeForInput(event.eventTimeEnd)
    };
  
   
    console.log('Formatted Event:', this.selectedEvent); 
    document.getElementById('viewEventDetailsModal')!.style.display = 'block';
  }

  formatTimeForInput(timeSpan: string): string {
    if (!timeSpan) return '';
    const formattedTime = timeSpan.substring(0, 8);
    return formattedTime;
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
            document.getElementById('createEventModal')!.style.display = 'none';
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Event created successfully', key: 'bc' });
            this.resetNewEvent();
            this.closeModal();
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

  editEvent(): void {
    if (this.selectedEvent) {
      document.getElementById('editEventModal')!.style.display = 'block';
    }
  }

  isEventValid(event: ScheduleEvent): boolean {
    // Title must be more than 20 characters
    if (!event.scheduleEventName || event.scheduleEventName.length <= 20) {
      return false;
    }

    // Description must be more than 50 characters
    if (!event.eventDescription || event.eventDescription.length <= 50) {
      return false;
    }

    // Start time must be selected
    if (!event.eventTimeStart) {
      return false;
    }

    // End time must be selected
    if (!event.eventTimeEnd) {
      return false;
    }

    // Team ID must be selected
    if (!event.teamId) {
      return false;
    }

    return true;
  }


  //to clear the create event form 
  resetNewEvent(): void {
    this.newEvent = {
      scheduleEventName: '',
      eventDescription: '',
      scheduleEventDate: new Date(),
      eventTimeStart: '',
      eventTimeEnd: '',
      teamId: '',      
    userId: ''
      //  userId: this.authService.getCurrentUserId() ?? ''
    };
  }

  //ensuring that update event shows all the details
  updateEvent(): void {
    if (this.selectedEvent) {
      this.confirmationService.confirm({
        header: 'Confirm Update',
        message: 'Do you want to save the changes to this event?',
        accept: () => {
          const formattedEvent = this.formatEventForBackend(this.selectedEvent!);
          console.log('Updating event with data:', formattedEvent);
  
          this.eventService.updateScheduleEvent(this.selectedEvent!.scheduleEventId!, formattedEvent).subscribe({
            next: (data) => {
              const index = this.events.findIndex(e => e.scheduleEventId === this.selectedEvent!.scheduleEventId);
              if (index !== -1) {
                this.events[index] = data;
              }
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Event updated successfully', key: 'bc' });
              this.closeModal(); // Close the modal
            },
            error: (error) => {
              console.error('Failed to update event:', error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update event', key: 'bc' });
            }
          });
        },
        reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Event update cancelled', key: 'bc' });
        }
      });
    }
  }
  
  

  deleteEvent(scheduleEventId: string): void {
    this.confirmationService.confirm({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this event?',
      accept: () => {
        this.eventService.deleteScheduleEvent(scheduleEventId).subscribe({
          next: () => {
            this.events = this.events.filter(event => event.scheduleEventId !== scheduleEventId);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Event deleted successfully', key: 'bc' });
            this.closeModal(); // Close the modal
          },
          error: (error) => {
            console.error('Failed to delete event:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete event', key: 'bc' });
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Event deletion cancelled', key: 'bc' });
      }
    });
  }
  
  
  closeModal(): void {
    this.selectedEvent = null; 
    document.getElementById('createEventModal')!.style.display = 'none';
    document.getElementById('viewEventDetailsModal')!.style.display = 'none';
    document.getElementById('editEventModal')!.style.display = 'none';
  }

  getDaysInMonth(): { date: Date, day: number | null }[] {
    const days: { date: Date, day: number | null }[] = [];
    const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const firstDayIndex = date.getDay();
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ date: new Date(date.getFullYear(), date.getMonth(), date.getDate() - firstDayIndex + i), day: null });
    }
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
    this.scrollToCurrentTime();
  }

  initializeHours(): void {
    for (let i = 0; i < 24; i++) {
      const hour = i < 10 ? `0${i}:00` : `${i}:00`;
      this.hours.push(hour);
      const halfHour = i < 10 ? `0${i}:30` : `${i}:30`;
      this.hours.push(halfHour);
    }
  }

  getDayTimes(): { time: string }[] {
    return this.hours.map(hour => ({ time: hour }));
  }

  isToday(date: Date): boolean {
    return date.toDateString() === this.today.toDateString();
  }

  isSameDate(date1: Date | string, date2: Date): boolean {
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1; // Ensure date1 is a Date object
    return d1.toDateString() === date2.toDateString();
  }

  //to help with mapping events into the day and week view 
  isSameTime(eventTime: string | undefined, timeSlot: string): boolean {
    if (!eventTime || !timeSlot) return false;
    const [eventHour, eventMinute] = eventTime.split(':');
    const [slotHour, slotMinute] = timeSlot.split(':');
    return eventHour === slotHour && eventMinute === slotMinute;
  }
  
  
  

  scrollToCurrentTime(): void {
    if (this.currentView === 'day' || this.currentView === 'week') {
      const currentHour = new Date().getHours();
      setTimeout(() => {
        const currentTimeElement = this.elementRef.nativeElement.querySelector(`#time-${currentHour}`);
        if (currentTimeElement) {
          currentTimeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          currentTimeElement.classList.add('highlight');
        }
      }, 100);
    }
  }
  formatTimeToTimeSpan(hours: string, minutes: string): string {
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  }

  formatTimeToTimeSpanFromString(time: string): string {
    const [hours, minutes] = time.split(':');
    return this.formatTimeToTimeSpan(hours, minutes);
  }

  formatDate(date: Date | string): string {
    // Ensure the date is a Date object and format it to yyyy-MM-dd
    if (typeof date === 'string') {
      date = new Date(date);
    }
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    } else {
      throw new Error('Invalid date format');
    }
  }

  getTeamName(teamId: string | undefined): string {
    if (!teamId) {
        return 'Unknown Team';
    }
    const team = this.teams.find(t => t.teamId === teamId);
    return team ? team.teamName : 'Unknown Team';
}
  //fixing the date when clicked 
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
  
}
