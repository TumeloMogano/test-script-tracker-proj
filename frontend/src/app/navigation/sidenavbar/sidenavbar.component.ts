import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { PermissionsService } from '../../services/auth/permissions.service';
import { Permissions } from '../../models/permissions.enums';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrls: ['./sidenavbar.component.scss']
})
export class SidenavbarComponent implements OnInit {
  Permissions = Permissions;


  isSidebarClosed = true;
  currentRoute: string = '';
  activeDropdown: any = null;

  private routerSubscription: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private permissionsService: PermissionsService,
    private confirmationService: ConfirmationService
  ) { }


  menuItems = [
    { label: 'Dashboard', icon: 'bx bxs-home', link: '/dashboard', permission: Permissions.None },
    { label: 'Clients', icon: 'bx bxs-briefcase', link: '/clients', permission: Permissions.None },
    { label: 'Projects', icon: 'bx bxs-archive', link: '/projects', permission: Permissions.None },
    { label: 'Test Schedule', icon: 'bx bxs-calendar', link: '/calendar', permission: Permissions.None },
    { label: 'Users', icon: 'bx bxs-user', link: '/user-list', permission: Permissions.canViewUsers },
    { label: 'Notifications', icon: 'bx bxs-message-rounded-dots', link: '/notifications', permission: Permissions.None },
    { label: 'Templates', icon: 'bx bxs-notepad', link: '/template-list', permission: Permissions.None },
    { label: 'Teams', icon: 'bx bxs-group', link: '/teams', permission: Permissions.None },
    {
      label: 'Reports', icon: 'bx bxs-report', isOpen: false, permission: Permissions.SystemAdministrator, subItems: [
        { label: 'Registered User Report', link: '/registered-users-report', permission: Permissions.None },
        { label: 'Active Project Report', link: '/active-projects-report', permission: Permissions.None },
        { label: 'Template Report', link: '/templates-report', permission: Permissions.None },
        { label: 'Client Report', link: '/clients-report', permission: Permissions.None },
        { label: 'Defect Report', link: '/defects-report', permission: Permissions.None },
        { label: 'Project Phase Report', link: '/project-phase-report',permission: Permissions.None },
        { label: 'User Load Report', link: '/user-load-report',permission: Permissions.None },
        { label: 'Test Script Status Report', link: '/test-script-status-report', permission: Permissions.None },
        { label: 'Assigned Scripts Report', link: '/assigned-scripts-report', permission: Permissions.None }
      ]
    },
    { label: 'Roles & Permissions', icon: 'bx bxs-lock open', link: '/roles', permission: Permissions.canViewRoles },

    {
      label: 'System', icon: 'bx bx-cog', isOpen: false, permission: Permissions.None, subItems: [
        { label: 'Statuses & Tags', link: '/system', permission: Permissions.canViewStatusesTags },
        { label: 'Backup Management', link: '/backup', permission: Permissions.SystemAdministrator },
        { label: 'Lookup: Country', link: '/lookup', permission: Permissions.None },
        { label: 'Lookup: Region', link: '/region', permission: Permissions.None },
        { label: 'Lookup: City', link: '/city', permission: Permissions.None },
        { label: 'Auditlog',  link: '/auditlog', permission: Permissions.SystemAdministrator }
      ]
    },
    //{ label: 'Backup Management', icon: 'bx bx-data', link: '/backup', permission: Permissions.None },

    { label: 'Help', icon: 'bx bxs-help-circle', link: '/help', permission: Permissions.None }
    // { label: 'Update Password', icon: 'bx bx-fingerprint', link: '/resetpassword1', permission: Permissions.None }
  ];

  ngOnInit(): void {
    this.closeSidebar();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url || '';
        this.closeSidebar();
        this.closeAllDropdowns();
      }
    });

    // Highlight the first page as active if no current route
    if (this.menuItems.length > 0 && this.currentRoute === '') {
      this.currentRoute = this.menuItems[0].link!;
    }

    const btn = document.querySelector('#btn1');
    const sidebar = document.querySelector('.sidebar');
    const homeSection = document.querySelector('.home-section1') as HTMLElement;
    const header = document.querySelector('header') as HTMLElement;

    if (btn && sidebar && homeSection && header) {
      btn.addEventListener('click', () => {
        this.toggleSidebar();
      });
    }
  }


  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
    this.updateLayout();
  }

  onLogout(): void {
    this.confirmationService.confirm({
      header: 'Log Out?',
      message: 'Are you sure you want to log out?',
      accept: () => {
        this.clearPendingActions();
        this.authService.logout();
        this.router.navigate(['/login2']);
      },
      reject: () => {
        console.log('Logout cancelled');
      }
    });
  }
  clearPendingActions(): void {
    // Clear any state or pending actions related to comments or forms
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  hasPermission(permission: Permissions): boolean {
    return this.permissionsService.hasPermission(permission)
  }

  goUser() {
    const userId = this.authService.getCurrentUserId();

    if (userId) {
      this.router.navigate(['/view-profile', userId]);
    }
  }


  closeSidebar() {
    this.isSidebarClosed = true;
    this.updateLayout();
  }

  updateLayout() {
    const sidebar = document.querySelector('.sidebar');
    const homeSection = document.querySelector('.home-section1') as HTMLElement;
    const header = document.querySelector('header') as HTMLElement;

    if (sidebar && homeSection && header) {
      if (this.isSidebarClosed) {
        sidebar.classList.add('closed');
        header.style.left = '78px';
        header.style.width = 'calc(100% - 78px)';
        homeSection.style.left = '78px';
        homeSection.style.width = 'calc(100% - 78px)';
      } else {
        sidebar.classList.remove('closed');
        header.style.left = '250px';
        header.style.width = 'calc(100% - 250px)';
        homeSection.style.left = '250px';
        homeSection.style.width = 'calc(100% - 250px)';
      }
    }
  }

  toggleDropdown(item: any) {
    item.isOpen = !item.isOpen;
    this.activeDropdown = item.isOpen ? item : null;
  }

  closeAllDropdowns() {
    this.menuItems.forEach(item => {
      if (item.subItems) {
        item.isOpen = false;
      }
    });
    this.activeDropdown = null;
  }

  closeSidebarAndDropdowns() {
    this.closeSidebar();
    this.closeAllDropdowns();
  }

  isSubItemActive(item: any): boolean {
    return item.subItems ? item.subItems.some((sub: any) => this.currentRoute === sub.link) : false;
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const target = event.target as HTMLElement;

    // Close dropdown if clicked outside
    if (this.activeDropdown) {
      const clickedInsideDropdown = target.closest('.dropdown');
      if (!clickedInsideDropdown) {
        this.closeAllDropdowns();
      }
    }

    // Close sidebar if clicked outside
    const clickedInsideSidebar = target.closest('.sidebar');
    if (!clickedInsideSidebar && !this.isSidebarClosed) {
      this.closeSidebar();
    }
  }

}