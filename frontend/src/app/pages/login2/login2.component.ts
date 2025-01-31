import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '../../models/auth/auth.model';
import { AuthService } from '../../services/auth/auth.service';
import { JwtService } from '../../services/auth/jwt.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';


//declared my bootstrap for the modal 
declare var bootstrap: any; 

@Component({
  selector: 'app-login2',
  standalone: true,
  imports: [FormsModule,HttpClientModule, CommonModule],
  templateUrl:'./login2.component.html',
  styleUrls: ['./login2.component.scss']
})
export class Login2Component {

  loginData: LoginRequest = {
    email: '',
    password: ''
  };

 loginObj: Login;
 @ViewChild('errorModal') errorModal!: ElementRef   ;
 errorMessage: string = 'Invalid username or password.';

 constructor(
  private http:HttpClient,
  private router: Router, 
  private loginService: AuthService,
  private jwtService: JwtService,
  private messageService: MessageService){
  this.loginObj = new Login();
 }

//  onSubmit() {
//     this.loginService.login(this.loginData).subscribe(
//       response => {
//         console.log('Login successful', response);
//         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login Successful', key: 'tl'});
//         this.router.navigate(['/projects']);
//       },
//       error => {
//         console.error('Login failed', error);
//         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Login failed', key: 'bc' });
//       }
//     );
//  }

onSubmit(): void {
  this.loginService.login(this.loginData).subscribe();
}

goBack(): void{
  this.router.navigate(['/projects']);
}

 onLogin(){
  this.http.post('https://localhost:7089/api/Authentication/login',this.loginObj).subscribe(
    () =>{
      this.goBack();
    },
    (error) => {
      this.showErrorModal();
    }
  );
 }
 showErrorModal(): void {
  const errorModalElement = document.getElementById('errorModal');
  if (errorModalElement) {
    const errorModal = new bootstrap.Modal(errorModalElement, {});
    errorModal.show();
  }
}

inputType: string = 'password';
eyeIcon: string = 'fa-eye';

togglePasswordVisibility() {
  if (this.inputType === 'password') {
    this.inputType = 'text';
    this.eyeIcon = 'fa-eye-slash';
  } else {
    this.inputType = 'password';
    this.eyeIcon = 'fa-eye';
  }
}

onforgotpassword(): void{
  this.router.navigate(['/forgotpassword1'])
}
goBackToLogin(): void{
  this.router.navigate(['/login2']);
}
goRegister(): void{
  this.router.navigate(['/user-register'])
}
}


export class Login{
  loginUserName: string;
  loginPassword: string;

  constructor(){
    this.loginUserName ='';
    this.loginPassword ='';
  }

  

}
