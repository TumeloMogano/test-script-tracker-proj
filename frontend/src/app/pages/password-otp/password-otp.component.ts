import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import zxcvbn from 'zxcvbn';

@Component({
  selector: 'app-password-otp',
  templateUrl: './password-otp.component.html',
  styleUrl: './password-otp.component.scss'
})
export class PasswordOTPComponent {


  passwordOtpObj: PasswordOtp;
  errorMessage: string = '';
  inputType: string = 'password'; 
  eyeIcon: string = 'fa-eye'; 
  passwordStrengthScore: number = 0;
  passwordFeedback: string = '';
  passwordStrengthDescription: string = '';

  constructor(private http: HttpClient, private router: Router,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService
  ) {
    this.passwordOtpObj = new PasswordOtp();
  }

  goBack(): void {
    this.router.navigate(['/login2']);
  }

  onPasswordOtp() {
    if (this.passwordStrengthScore < 3) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Weak Password',
        detail: 'Please choose a stronger password before submitting. It should be at least "Strong".',
        key: 'bc'
      });
      return; 
    }
    
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to submit the OTP and reset the password?',
      accept: () => {
        this.http.post('https://localhost:7089/api/Authentication/VerifyOtpAndResetPassword', this.passwordOtpObj, { responseType: 'text' })
          .subscribe(
            (response: string) => {
              console.log(response);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password reset successfully', key: 'bc' });
              this.goBack();
            },
            (error) => {
              console.error('Error occurred:', error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error sending password reset request. Please try again.', key: 'bc' });
            }
          );
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Password reset request was cancelled', key: 'bc' });
        this.goBack();
      }
    });
  }

    checkPasswordStrength(password: string) {
      const result = zxcvbn(password);
      this.passwordStrengthScore = result.score; 
      this.passwordFeedback = result.feedback.suggestions.join(' ') || result.feedback.warning || 'Strong password!';
      switch (this.passwordStrengthScore) {
        case 0:
          this.passwordStrengthDescription = 'Too Short';
          break;
        case 1:
          this.passwordStrengthDescription = 'Weak';
          break;
        case 2:
          this.passwordStrengthDescription = 'Medium';
          break;
        case 3:
          this.passwordStrengthDescription = 'Strong';
          break;
        case 4:
          this.passwordStrengthDescription= 'Very Strong';
          break;
      }
    }
  

  togglePasswordVisibility(): void {
    if (this.inputType === 'password') {
      this.inputType = 'text';
      this.eyeIcon = 'fa-eye-slash'; 
    } else {
      this.inputType = 'password';
      this.eyeIcon = 'fa-eye';      
    }
  }
}

export class PasswordOtp { 
  userEmailAddress: string;  
  otpCode: number;
  newPassword: string;

  constructor( ){
    this.userEmailAddress='';
    this.otpCode = 0;
    this.newPassword='';
    
  }
}