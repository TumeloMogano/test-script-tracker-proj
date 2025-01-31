// import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AspUsers } from '../../../models/aspusers';
// import { AspUsersServices } from '../../../services/aspnetusers/aspnetusers';

// @Component({
//   selector: 'app-user-update',
//   templateUrl: './user-update.component.html',
//   styleUrl: './user-update.component.scss'
// })
// export class UserUpdateComponent implements OnInit {
//   userForm!: FormGroup;
//   useremail?: string = '';

//   constructor(
//     private fb: FormBuilder,
//     private router: Router, 
//     private userService: AspUsersServices, 
//     private route: ActivatedRoute
//   ) {}

//   ngOnInit(): void {
//     this.useremail = this.route.snapshot.paramMap.get('useremail') || '';
//     this.loadUserDetails(this.useremail);

//     this.userForm = this.fb.group({
//       userFirstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z]+$/)]], // Updated pattern for letters only
//       userSurname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z]+$/)]], // Updated pattern for letters only
//       userIDNumber: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]], // Adjust pattern as per ID number format
//       userContactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // Updated pattern for 10 digits
//       userEmailAddress: ['', [Validators.required, Validators.email]],
//       templateCreation: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]]
//     });
//   }

//   get userFirstName() {
//     return this.userForm.get('userFirstName');
//   }

//   get userSurname() {
//     return this.userForm.get('userSurname');
//   }

//   get userIDNumber() {
//     return this.userForm.get('userIDNumber');
//   }

//   get userContactNumber() {
//     return this.userForm.get('userContactNumber');
//   }

//   get userEmailAddress() {
//     return this.userForm.get('userEmailAddress');
//   }

//   get templateCreation() {
//     return this.userForm.get('templateCreation');
//   }
  
//   getError(controlName: string, errorName: string) {
//     return this.userForm.controls[controlName].hasError(errorName);
//   }

//   viewUserDetails(email?: string): void {
//     this.router.navigate(['/user-details', email]);
//   }
//   goList(): void {
//     this.router.navigate(['/user-list'])
//   }
//   loadUserDetails(email: string): void {
//     this.userService.getUserByEmail(email).subscribe((user: AspUsers) => {
//       this.userForm.patchValue({
//         userFirstName: user.userFirstName,
//         userSurname: user.userSurname,
//         userIDNumber: user.userIDNumber,
//         userContactNumber: user.userContactNumber,
//         userEmailAddress: user.userEmailAddress,
//         templateCreation: user.templateCreation
//       });
//     });
//   }

//   updateUser(): void {
//     if (this.userForm.valid) {
//       const updatedUser: AspUsers = this.userForm.value;
//       this.userService.updateUser(this.useremail, updatedUser).subscribe(
//         response => {
//           console.log('User updated successfully', response);
//           this.router.navigate(['/user-list']);
//         },
//         error => {
//           console.error('Error updating user', error);
//         }
//       );
//     } else {
//       console.error('Form is invalid');
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AspUsers } from '../../../models/aspusers';
import { AspUsersServices } from '../../../services/aspnetusers/aspnetusers';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit {
  user: AspUsers = {
    userFirstName: '',
    userSurname: '',
    userIDNumber: '',
    userContactNumber: '',
    userEmailAddress: '',
    templateCreation: ''
  };
  useremail?: string = '';
  userForm: FormGroup;

  constructor(
    private router: Router, 
    private fb: FormBuilder,
    private userService: AspUsersServices, 
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.userForm = this.fb.group({
      userFirstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z]+$')]],
      userSurname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z]+$')]],
      userContactNumber: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      userEmailAddress: ['', [Validators.required, Validators.email]],
      userIDNumber: ['', [Validators.required, Validators.pattern('^\\d{13}$'), this.idNumberValidator(18, 60)]],
    });
  }

  ngOnInit(): void {
    this.useremail = this.route.snapshot.paramMap.get('useremail') || '';
    this.loadUserDetails(this.useremail);

    this.userForm.get('userEmailAddress')?.disable();
    this.userForm.get('userIDNumber')?.disable();

  }

  loadUserDetails(email: string): void {
    this.userService.getUserByEmail(email).subscribe((user: AspUsers) => {
      this.user = user;
      this.userForm.patchValue({
        userFirstName: user.userFirstName,
        userSurname: user.userSurname,
        userContactNumber: user.userContactNumber,
        userEmailAddress: user.userEmailAddress,
        userIDNumber: user.userIDNumber
      })
      this.userForm.get('userEmailAddress')?.disable();
      this.userForm.get('userIDNumber')?.disable();
    });
  }
  goList(): void {
   this.router.navigate(['/user-list'])
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
  
  // updateUser(): void {
  //   if (this.userForm.valid) {
  //     this.userService.updateUser(this.useremail, this.user).subscribe(
  //       response => {
  //         console.log('User updated successfully', response);
  //         this.router.navigate(['/user-list']);
  //       },
  //       error => {
  //         console.error('Error updating user', error);
  //       }
  //     );
  //   } else {
  //     console.error('Form is invalid');
  //   }
  // }

  updateUser(): void { 
    console.log(this.userForm);
    this.user = this.userForm.value;
    if (this.userForm.invalid){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User update failed due to validation errors',
        key: 'bc'
      });
      return;
    }
    if (this.userForm.valid) {
    this.user = this.userForm.getRawValue(); 
    this.user.userEmailAddress = this.user.userEmailAddress; 
    this.user.userIDNumber = this.user.userIDNumber; 

    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to update this user?',
      accept: () => {
        console.log(this.user);
        if (this.user.userEmailAddress){
          this.userService.updateUser(this.user.userEmailAddress, this.user).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Updated',
              detail: 'User updated successfully',
              key: 'bc'
            });
            this.router.navigate(['/user-list']);
          },
          error => {
            console.error('Validation Errors:', error.error.errors);  
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update user',
              key: 'bc'
            });
            });}
      },
      reject: () => {
        
      }
    });
}}}
