import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { NotificationDto } from '../../models/notificationDTO';
import { NotificationService } from '../../services/notifications/notification.service';
import { AuthService } from '../../services/auth/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, AfterViewChecked {
  notifications: NotificationDto[] = [];
  searchNotificationQuery: string = '';
  searchNotificationByUserQuery: string = '';
  searchQuery: string = '';
  users: any[] = [];
  showModal: boolean = false;
  viewModal: boolean = false; 
  isUpdate: boolean = false;
  notificationTitle: string = '';
  notificationMessage: string = '';
  selectedUserId: string = '';
  selectedUserFirstName: string = ''; 
  selectedNotification: NotificationDto | null = null;

  constructor(private notificationService: NotificationService,
    private authService: AuthService, private confirmationService: ConfirmationService, 
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getNotifications();
  }

ngAfterViewChecked(): void {
  this.initializeTooltips();
}

initializeTooltips(): void{
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach((tooltipTriggerE1) => {
    const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipTriggerE1);
    if (!tooltipInstance){
      new bootstrap.Tooltip(tooltipTriggerE1);
    }
  })
}

hideTooltip (iconId: string): void {
  const tooltipElement = document.getElementById(iconId);
  if(tooltipElement){
    const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipElement);
    if (tooltipInstance){
      tooltipInstance.hide();
    }
  }
}
  //Notifications according to logged in user 
  // getNotifications(): void {
  //   //auth service to retrieve notifications according to logged in user 
  //   const loggedInUserId = this.authService.getCurrentUserId(); // Retrieve the user's ID
  //   if (loggedInUserId) {
  //     this.notificationService.getNotifications(loggedInUserId).subscribe(
  //       (data) => {
  //         this.notifications =  data.map((notification) => {
  //           notification.isOpened = !!notification.isOpened; 
  //           return notification;
  //       },
  //       (error) => {
  //         console.error('Error fetching notifications', error);
  //       }
  //     );
  //   } else {
  //     console.error('No logged-in user found.');
  //   }
  // }
  getNotifications(): void {
    const loggedInUserId = this.authService.getCurrentUserId();
    if (loggedInUserId) {
      this.notificationService.getNotifications(loggedInUserId).subscribe(
        (data) => {
          this.notifications = data.map((notification) => {
            notification.isOpened = !!notification.isOpened; 
            console.log('Notification ID:', notification.notificationId, 'Is Opened:', notification.isOpened);
            return notification;
          });
        },
        (error) => {
          console.error('Error fetching notifications', error);
        }
      );
    }
  }
  
  // viewNotification(notification: NotificationDto): void {
  //   this.selectedNotification = notification; 
  //   this.toggleViewModal(); 
  // }
  //adding color to shown when opened or not
  viewNotification(notification: NotificationDto): void {
    notification.isOpened = true;
  
    this.notificationService.markNotificationAsOpened(notification.notificationId).subscribe({
      next: () => {
        console.log('Notification marked as read');
      },
      error: (error) => {
        console.error('Error marking notification as read', error);
      }
    });
  
    this.selectedNotification = notification;
    this.toggleViewModal(); 
  }
  

  toggleViewModal(): void {
    this.viewModal = !this.viewModal;
  }

  //without validations
  // sendNotification() {
  //   if (this.selectedUserId && this.notificationTitle && this.notificationMessage) {
  //     this.confirmationService.confirm({
  //       header: 'Confirmation',
  //       message: 'Are you sure you want to send this notification?',
  //       accept: () => {
  //         const payload = {
  //           Id: this.selectedUserId,
  //           Title: this.notificationTitle,
  //           Message: this.notificationMessage
  //         };
  
  //         this.notificationService.sendNotification(payload)
  //           .subscribe({
  //             next: () => {
  //               this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Notification sent successfully', key: 'bc' });
  
  //               // Clearing the form
  //               this.selectedUserId = '';   
  //               this.notificationTitle = '';
  //               this.notificationMessage = '';

  //               //closinf the form after successul sending it
  //               this.showModal = false;
  //             },
  //             error: (err) => {
  //               console.error('Error sending notification', err);
  //               this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to send notification', key: 'bc' });
  //             }
  //           });
  //       },
  //       reject: () => {
  //         this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Notification sending cancelled', key: 'bc' });
  //       }
  //     });
  //   } else {
  //     this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill in all required fields.', key: 'bc' });
  //   }
  // }

  //validations
  sendNotification() {
    let isValid = true;
  
    // Check if a user is selected
    if (!this.selectedUserId) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please select a user.', key: 'bc' });
      isValid = false;
    }
  
    // Check if the title is at least 20 characters
    if (this.notificationTitle.length < 20) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'The title must be at least 20 characters long.', key: 'bc' });
      isValid = false;
    }
  
    // Check if the message is at least 50 characters
    if (this.notificationMessage.length < 50) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'The message must be at least 50 characters long.', key: 'bc' });
      isValid = false;
    }
  
    if (isValid) {
      this.confirmationService.confirm({
        header: 'Confirmation',
        message: 'Are you sure you want to send this notification?',
        accept: () => {
          const payload = {
            Id: this.selectedUserId,
            Title: this.notificationTitle,
            Message: this.notificationMessage
          };
  
          this.notificationService.sendNotification(payload)
            .subscribe({
              next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Notification sent successfully', key: 'bc' });
  
                // Clear the form fields
                this.selectedUserId = '';   
                this.notificationTitle = '';
                this.notificationMessage = '';
  
                // Close the modal
                this.showModal = false;
              },
              error: (err) => {
                console.error('Error sending notification', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to send notification', key: 'bc' });
              }
            });
        },
        reject: () => {
          this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Notification sending cancelled', key: 'bc' });
        }
      });
    }
  }
  

  confirmAndRemoveNotification(notificationId: string): void {
    if (!notificationId) {
      console.error('Notification ID is undefined or null.');
      return;
  }
    
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: 'Are you sure you want to delete this notification?',
      accept: () => {
        this.notificationService.removeNotification(notificationId).subscribe(
          () => {
            this.getNotifications();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Notification deleted successfully', key: 'bc' });
          },
          (error) => {
            console.error('Error deleting notification', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete notification', key: 'bc' });
          }
        );
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Notification deletion cancelled', key: 'bc' });
      }
    });
  }
  

  searchNotifications(): void {
    if (this.searchNotificationQuery.trim() !== '') {
      this.notificationService.searchNotifications(this.searchNotificationQuery).subscribe(
        (data) => {
          this.notifications = data;
        },
        (error) => {
          console.error('Error searching notifications', error);
        }
      );
    } else {
      this.getNotifications();
    }
  }

searchNotificationsByUser(): void {
  const loggedInUserId = this.authService.getCurrentUserId();
  if (loggedInUserId && this.searchNotificationByUserQuery.trim() !== '') {
    this.notificationService.searchNotificationsByUser(loggedInUserId, this.searchNotificationByUserQuery).subscribe(
      (data) => {
        this.notifications = data;
      },
      (error) => {
        console.error('Error searching notifications for user:', loggedInUserId, 'Query:', this.searchNotificationByUserQuery, error);
      }
    );
  } else {
    this.getNotifications();
  }
}
  searchUsers(): void {
    if (this.searchQuery.trim() !== '') {
      this.notificationService.searchUsersByUsername(this.searchQuery).subscribe(
        (data) => {
          this.users = data;
        },
        (error) => {
          console.error('Error searching users', error);
        }
      );
    }
  }

 selectUser(user: any) {
  if (user && user.id) {
    this.selectedUserId = user.id;  
    console.log("Selected User ID:", this.selectedUserId);  
  } else {
    console.error("User selection failed. User object or ID is missing.");
  }
}

  toggleModal(isUpdate: boolean = false): void {
    this.showModal = !this.showModal;
    this.isUpdate = isUpdate;
    this.notificationTitle = '';
    this.notificationMessage = '';
    this.searchQuery = '';
    this.selectedUserId = '';
    this.selectedUserFirstName = '';
    this.users = [];
  }
}
