
export interface ScheduleEvent {
  scheduleEventId?: string;
  scheduleEventName: string;
  eventDescription: string;
  scheduleEventDate: Date;
  eventTimeStart: string;
  eventTimeEnd: string;
  teamId: string;
  userId: string; 

  teamName?: string;
}
