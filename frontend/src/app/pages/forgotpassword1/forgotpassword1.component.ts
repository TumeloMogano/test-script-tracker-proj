import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-forgotpassword1',
  templateUrl: './forgotpassword1.component.html',
  styleUrls: ['./forgotpassword1.component.scss']
})
export class Forgotpassword1Component {

    
  forgotpasswordObj: ForgotPassword;
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, 
    private confirmationService: ConfirmationService,
    private messageService: MessageService    ) {
    this.forgotpasswordObj = new ForgotPassword();
  }

  goBack(): void {
    this.router.navigate(['/password-otp']);
  }


onForgotPassword() {
  if (!this.forgotpasswordObj.userEmailAddress) {
    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Email address is required.', key: 'bc' });
    return;
  }
  this.confirmationService.confirm({
    header: 'Confirm',
    message: 'Are you sure you want to reset the password?',
    accept: () => {
      const headers = { 'Content-Type': 'application/json' };
      this.http.post('https://localhost:7089/api/Authentication/ForgotPassword', this.forgotpasswordObj, { headers }).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password reset email sent successfully.', key: 'bc' });
          this.goBack();
        },
        (error) => {
          console.error('Error response:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error sending password reset email. Please check the email address and try again.', key: 'bc' });
        }
      );
    },
    reject: () => {
      this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Password reset request cancelled.', key: 'bc' });
    }
  });
}

}

export class ForgotPassword {
  userEmailAddress: string;

  constructor() {
    this.userEmailAddress = '';
  }
}