import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import zxcvbn from 'zxcvbn';

@Component({
  selector: 'app-resetpassword1',
  templateUrl: './resetpassword1.component.html',
  styleUrl: './resetpassword1.component.scss'
})
export class Resetpassword1Component {
  ResetObj: Reset;
  errorMessage: string = 'Invalid username or password.';
  inputType: string = 'password'; 
  eyeIcon: string = 'fa-eye'; 
  passwordStrengthScore: number = 0;
  passwordFeedback: string = '';
  passwordStrengthDescription: string = '';
 
  constructor(private http:HttpClient, private router: Router, private authService: AuthService,
    private confirmationService: ConfirmationService, private messageService: MessageService
  ){
   this.ResetObj = new Reset(); // Automatically set the user email and username from the AuthService
   this.ResetObj.userEmailAddress = this.authService.getCurrentUserEmail() || '';
   //this.ResetObj.loginUserName = this.authService.getUserDetails()?.firstName || '';// aim is to get the logged in users email address
  }
 
 goBack(): void{
   this.router.navigate(['/dashboard']);
 }

 onReset() {
  // if (!this.ResetObj.currentPassword || !this.ResetObj.newPassword) {
  //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'All fields are required.', key: 'bc' });
  //   return;
  // }
  if (this.passwordStrengthScore < 3) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Weak Password',
      detail: 'Please choose a stronger password before submitting. It should be at least "Strong".',
      key: 'bc'
    });
    return; // Do not proceed if the password is weak
  }

  this.confirmationService.confirm({
    header: 'Confirm',
    message: 'Are you sure you want to reset your password?',
    accept: () => {
      this.http.post('https://localhost:7089/api/Authentication/update-password-no-check', this.ResetObj, { responseType: 'text' }).subscribe(
        (response: string) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response, key: 'bc' });
          this.goBack();
        },
        (error) => {
          console.error('Error updating password:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update password.', key: 'bc' });
        }
      );
    },
    reject: () => {
      this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Password reset request cancelled.', key: 'bc' });
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
 
 
 export class Reset{
   currentPassword: string;
   newPassword: string;
   userEmailAddress: string;
   //loginUserName: string 
 
   constructor(){
     this.currentPassword ='';
     this.newPassword ='';
   //  this.loginUserName ='';
     this.userEmailAddress ='';
   }
 }
 
