import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { AspUsers } from '../../../models/aspusers';
import { NgForm } from '@angular/forms';
import { UsersService } from '../../../services/users/users.service';
import { AspUsersServices } from '../../../services/aspnetusers/aspnetusers';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-user-request',
  templateUrl: './user-request.component.html',
  styleUrl: './user-request.component.scss',
  
})
export class UserRequestComponent {
  user: AspUsers = {
    userFirstName: '',
    userSurname: '',
    userIDNumber: '',
    userContactNumber: '',
    userEmailAddress: '',
    email: '',
    passwordHash: ''
  };
  requestForm: FormGroup;
  constructor(private router: Router, private userService: AspUsersServices, private _snackBar: MatSnackBar,
    public messageService: MessageService,
  public confirmationService: ConfirmationService, private fb: FormBuilder){
    this.requestForm = this.fb.group({
      userFirstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z]+$')]],
      userSurname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z]+$')]],
      userContactNumber: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      userEmailAddress: ['', [Validators.required, Validators.email]],
      userIDNumber: ['', [Validators.required, Validators.pattern('^\\d{13}$'), this.idNumberValidator(18, 60)]],
    });
  }
  
  goBack() : void {
    this.router.navigate(['/login2'])
  }
  // Custom validator to check the user's age based on the South African ID number
  idNumberValidator(minAge: number, maxAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const idNumber = control.value;
      if (!idNumber || idNumber.length !== 13) {
        return { invalidIdNumber: true };
      }

      const currentYear = new Date().getFullYear();
      const birthYear = parseInt(idNumber.substring(0, 2), 10);
      const birthMonth = parseInt(idNumber.substring(2, 4), 10);
      const birthDay = parseInt(idNumber.substring(4, 6), 10);

      // Determine the full birth year
      const fullBirthYear = birthYear > currentYear % 100 ? 1900 + birthYear : 2000 + birthYear;
      const birthDate = new Date(fullBirthYear, birthMonth - 1, birthDay);
      const age = currentYear - fullBirthYear;

      // Check if the calculated age is within the specified range
      if (age < minAge || age > maxAge) {
        return { ageOutOfRange: true };
      }

      return null;
    };
  }

// changePage(form: NgForm): void{
//   if (form && form.valid){
//   this.registrationRequest();}
//   else {
//     console.error('Form is invalid');
//   }
// }
// Method to handle form submission
changePage() {
  if (this.requestForm.valid) {
 this.registrationRequest();}
 else {
       console.error('Form is invalid');
     }
}
openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action);
}

registrationRequest(): void {
  var exists: Boolean = false;
  console.log(this.requestForm);
  this.user = this.requestForm.value;
  if (this.user.userEmailAddress){
  this.userService.getUserByEmail(this.user.userEmailAddress).subscribe((testUser) =>{
    if(testUser.id != null){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Entered email address is already being used',
        key: 'bc'
      })
      exists = true;
      return;
    }
  })}
if(this.requestForm.valid && exists == false){
  this.confirmationService.confirm({
    header: 'Confirm',
    message: 'Are you sure you want to request to register?',
    accept: () => {
      console.log(this.user);
      if (this.user.userEmailAddress){
        this.userService.registrationRequest(this.user).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Requested',
            detail: 'User registration requested successfully',
            key: 'bc'
          });
          this.router.navigate(['/login2']);
        },
        error => {
          console.error('Validation Errors:', error);  
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'User registration request failed',
            key: 'bc'
          });
          this.router.navigate(['/login2']);
          });}
    },
    reject: () => {
      
    }
  });}
// }
//   else {
    // this.messageService.add({
    //   severity: 'error',
    //         summary: 'Error',
    //         detail: 'User email has an existing account',
    //         key: 'bc'
          
    // })
  // }
}}
