import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-popup',
  template: `
    <h1 mat-dialog-title>Select a User</h1>
    <div mat-dialog-content>
      <mat-list>
        <mat-list-item *ngFor="let user of filteredUsers" (click)="selectUser(user)">
          <h4 mat-line>{{ user.userFirstName }} {{ user.userSurname }}</h4>
        </mat-list-item>
      </mat-list>
    </div>
  `,
  styleUrls: ['./user-popup.component.scss']
})
export class UserPopupComponent {
  filteredUsers: any[];

  constructor(
    public dialogRef: MatDialogRef<UserPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Filter out the current user from the list
    this.filteredUsers = this.data.users.filter((user: { userEmailAddress: any; }) => user.userEmailAddress !== this.data.currentUserEmail);
  }

  selectUser(user: any) {
    this.dialogRef.close(user);
  }
}
