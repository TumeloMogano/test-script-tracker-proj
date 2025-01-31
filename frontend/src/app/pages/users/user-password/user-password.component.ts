import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AspUsers } from '../../../models/aspusers';
import { AspUsersServices } from '../../../services/aspnetusers/aspnetusers';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import zxcvbn from 'zxcvbn';

@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.component.html',
  styleUrl: './user-password.component.scss'
})
export class UserPasswordComponent implements OnInit{
  registeredUser: AspUsers = {
    userFirstName: '',
    userSurname: '',
    userIDNumber: '',
    userContactNumber: '',
    userEmailAddress: '',
    passwordHash: '',
    registrationCode: ''
  };
  usertype: string = '';
  useremail: string = '';
  regCode: string = '';
  passwordForm: any = {};
  passwordStrengthScore: number = 0;
  passwordFeedback: string = '';
  passwordStrengthDescription: string = '';
  constructor(private router: Router, private userService: AspUsersServices, private route: ActivatedRoute,
    public messageService: MessageService,
    public confirmationService: ConfirmationService){}
  
  ngOnInit(): void {
    this.usertype = this.route.snapshot.paramMap.get('usertype') || '';
    this.useremail = this.route.snapshot.paramMap.get('useremail') || '';
    this.regCode = this.route.snapshot.paramMap.get('regCode') || '';
    console.log('usertype:', this.usertype);
    console.log('useremail:', this.useremail);
    console.log('regCode:', this.regCode);
    this.getUserDetails(this.useremail);
  }
  // goSubmit(form: NgForm) : void {
  //   console.log('Submitted RegistrationCode:', this.registeredUser.registrationCode);
  //   console.log('Expected regCode:', this.regCode);
  //   if (form && form.valid && this.registeredUser.registrationCode === this.regCode) {
  //     this.registerUser();
  //   } else {
  //     console.error('Error submitting user details: Registration code does not match');
  //   }
  // }
  goSubmit(): void {
    console.log('Submitted RegistrationCode:', this.registeredUser.registrationCode);
    console.log('Expected regCode:', this.regCode);
    if (this.passwordStrengthScore < 3) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Weak Password',
        detail: 'Please choose a stronger password before submitting. It should be at least "Strong".',
        key: 'bc'
      });
      return; // Do not proceed if the password is weak
    }
    if (this.passwordForm && this.registeredUser.registrationCode === this.regCode) {
      this.confirmationService.confirm({
        header: 'Confirm',
        message: 'Are you sure you want to submit the registration details?',
        accept: () => {
          this.registerUser();
        },
        reject: () => {
          console.log('User cancelled the registration submission.');
        }
      });
    } else {
      console.error('Error submitting user details: Registration code does not exist, please contact admin.');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Registration code does not exist, please contact admin.',
        key: 'bc'
      });
    }
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
  getUserDetails(email: string): void {
    this.userService.getUserByEmail(email).subscribe(
      user => {
        this.registeredUser = user;
        console.log('Fetched user details:', this.registeredUser);
        if(this.registeredUser.regStatusId == 4){
          this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'User email is already registered',
          key: 'bc'
        });
        this.router.navigate(['/login2']);
      }
      },
      error => {
        console.error('Error fetching user details', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'User registration request does not exist, please contact admin.',
          key: 'bc'
        });
        this.router.navigate(['/login2']);
      }
    );
  }
  goBack() : void {
    this.router.navigate(['/login2'])
  }
  registerUser(): void {
    console.log('Registering user:', this.registeredUser);
    this.userService.registerUser(this.usertype, this.useremail, this.registeredUser).subscribe(
      response => {
        console.log('User registered successfully', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Registration success',
          key: 'bc'
        });
        this.router.navigate(['/login2']);
      },
      error => {
        console.error('Error registering user', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Registration failed to complete',
          key: 'bc'
        });
        this.ngOnInit();
      }
    );
  }
}
