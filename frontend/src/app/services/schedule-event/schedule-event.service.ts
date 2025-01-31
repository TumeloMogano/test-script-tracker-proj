import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScheduleEvent } from '../../models/schedule event';
import { Team } from '../../models/team/team.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ScheduleEventService {
  private apiUrl = `${environment.baseUrl}/ScheduleEvents`;

  // private apiUrl = 'https://localhost:7089/api/ScheduleEvents';

  constructor(private http: HttpClient) { }

  // Create a new ScheduleEvent
  createScheduleEvent(scheduleEvent: ScheduleEvent): Observable<ScheduleEvent> {
    return this.http.post<ScheduleEvent>(`${this.apiUrl}/CreateScheduleEvent`, scheduleEvent);
  }

  // Get all ScheduleEvents
  getAllScheduleEvents(): Observable<ScheduleEvent[]> {
    return this.http.get<ScheduleEvent[]>(`${this.apiUrl}/GetsAllScheduleEvent`);
  }

  // Get a ScheduleEvent by ID
  getScheduleEvent(scheduleEventId: string): Observable<ScheduleEvent> {
    return this.http.get<ScheduleEvent>(`${this.apiUrl}/GetScheduleEvent/${scheduleEventId}`);
  }

  // Update a ScheduleEvent
  updateScheduleEvent(scheduleEventId: string, scheduleEvent: ScheduleEvent): Observable<ScheduleEvent> {
    return this.http.put<ScheduleEvent>(`${this.apiUrl}/UpdateScheduleEvent/${scheduleEventId}`, scheduleEvent);
  }

  // Delete a ScheduleEvent
  // deleteScheduleEvent(scheduleEventId: string): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/DeleteScheduleEvent`, { params: { scheduleEventId } });
 deleteScheduleEvent(scheduleEventId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteScheduleEvent/${scheduleEventId}`);
  }  // }
 

  getAllTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/GetAllTeams`);
  }

  //get events for users
  getEventsForUser(): Observable<ScheduleEvent[]> {
    return this.http.get<ScheduleEvent[]>(`${this.apiUrl}/GetEventsForUser`);
  }
}
