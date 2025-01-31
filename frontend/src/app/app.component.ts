import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl:'./app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TestScriptTracker';

 showSidebarAndNavbar: boolean = false;

  // private excludedRoutes: (string | RegExp)[] = ['/login2', '/register','/forgotpassword1','/forgotpassword2','/password-otp','/resetpassword1',
  //   '/user-register', '/user-registeroption','/user-request','/^\/user-password\/[^\/]+\/[^\/]+\/[^\/]+$/']; // Add routes where you don't want to show sidebar and navbar

  // constructor(private router: Router) {
  //   this.router.events.pipe(
  //     filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
  //   ).subscribe((event: NavigationEnd) => {
  //     this.showSidebarAndNavbar = !this.excludedRoutes.includes(event.urlAfterRedirects);
  //   });
  // }
  private excludedRoutes: (string | RegExp)[] = [
    '/login2', '/register', '/forgotpassword1', '/forgotpassword2', '/password-otp', '/resetpassword1',
    '/user-register', '/user-registeroption', '/user-request', '/forbidden-403', 
    /^\/user-password\/[^\/]+\/[^\/]+\/[^\/]+$/  // Update the regex pattern here
  ]; // Add routes where you don't want to show sidebar and navbar

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showSidebarAndNavbar = !this.excludedRoutes.some(route => 
        typeof route === 'string' ? route === event.urlAfterRedirects : route.test(event.urlAfterRedirects)
      );
    });
  }
}
