export interface NotificationDto {
  notificationId: string;
  notificationTitle: string;
  message: string;
  notificationDate: Date;
  notificationTypeID: number;
  projectID: number | null;
  Id: string;
  senderName: string; 
  senderSurname: string; 
  isOpened: boolean;
}
