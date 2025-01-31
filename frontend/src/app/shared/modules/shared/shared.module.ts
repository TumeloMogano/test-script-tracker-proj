import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material Modules
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';

// PrimeNG Modules
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { NgxPaginationModule } from 'ngx-pagination';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownModule } from 'primeng/dropdown';

// PrimeNG Services
import { ConfirmationService, MessageService } from 'primeng/api';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MessagesModule } from 'primeng/messages';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Angular Material Modules
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    // PrimeNG Modules
    AutoCompleteModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    NgxPaginationModule,
    FieldsetModule,
    DropdownModule,
    MessagesModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    // Angular Material Modules
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    // PrimeNG Modules
    AutoCompleteModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    NgxPaginationModule,
    CalendarModule

  ],
  providers: [
    ConfirmationService,
    MessageService,
  ]
})
export class SharedModule { }