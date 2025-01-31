import { Component } from '@angular/core';
import { Router

 } from '@angular/router';
@Component({
  selector: 'app-user-registeroption',
  templateUrl: './user-registeroption.component.html',
  styleUrl: './user-registeroption.component.scss'
})
export class UserRegisteroptionComponent {
constructor(private router: Router){}
  
  
  goSubmit() : void {
    this.router.navigate(['/user-password'])
  }

}
