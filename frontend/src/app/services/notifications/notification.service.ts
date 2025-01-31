import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationDto } from '../../models/notificationDTO';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = `${environment.baseUrl}/Notifications`;


  // private apiUrl = 'https://localhost:7089/api/Notifications';

  constructor(private http: HttpClient) {}

  
  getNotifications(Id: string): Observable<NotificationDto[]> {
    return this.http.get<NotificationDto[]>(`${this.apiUrl}/${Id}`);
  }

  sendNotification(payload: { Id: string, Title: string, Message: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, payload);
  }
  
  // updateNotification(notificationId: string, notification: { title: string; message: string }): Observable<NotificationDto> {
  //   return this.http.put<NotificationDto>(`${this.apiUrl}/update/${notificationId}`, notification);
  // }

  removeNotification(notificationId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${notificationId}`);
  }

  searchNotifications(query: string): Observable<NotificationDto[]> {
    return this.http.get<NotificationDto[]>(`${this.apiUrl}/searchNotifications/${query}`);
  }

  // searching notifications according to what you have access to 
  searchNotificationsByUser(userId: string, query: string): Observable<NotificationDto[]> {
    return this.http.get<NotificationDto[]>(`${this.apiUrl}/searchNotificationsByUser/${userId}/${query}`);
  }

  searchUsersByUsername(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search/${query}`);
  }


  //marking it open or not 
  markNotificationAsOpened(notificationId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/markAsOpened/${notificationId}`, {});
  }

}

