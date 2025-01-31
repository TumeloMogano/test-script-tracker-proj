import { Component, OnInit } from '@angular/core';
import { BackupService } from '../../../services/backup/backup.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-backuprestore',
  templateUrl: './backuprestore.component.html',
  styleUrls: ['./backuprestore.component.scss']
})
export class BackuprestoreComponent implements OnInit{
  backupForm: FormGroup;
  backupFiles: string[] = [];
  selectedBackup: string | null = null;
  restoreAttempted = false;

  constructor(
    private fb: FormBuilder,
    private backupService: BackupService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.backupForm = this.fb.group({
      selectedBackup: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getAllBackups();
  }

  markTouched(controlName: string): void {
    this.backupForm.controls[controlName].markAllAsTouched();
  }

  createBackup(): void {
    this.backupService.createBackup().subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Backup created successfully.', key: 'tl' });
        this.getAllBackups();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create backup.', key: 'tl' });
      }
    })
  }

  confirmCreateBackup(): void {
    this.confirmationService.confirm({
      header: 'Create Backup?',
      message: 'Are you sure you want to create a new backup?',
      accept: () => {
        this.createBackup();
      }
    });
  }

  getAllBackups(): void {
    this.backupService.getAllBackups().subscribe({
      next: (backups) => {
        console.log('Backups fetched successfully:', backups);
        this.backupFiles = backups;
      },
      error: (error) => {
        console.error('Error fetching backups:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to retrieve backups.', key:'tl' });
      }
    });
  }

  restoreBackup(): void {
    if (this.backupForm.valid) {
      const selectedBackup = this.backupForm.value.selectedBackup;
      this.backupService.restoreBackup(selectedBackup).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Backup restored successfully.', key: 'tl' });
          this.backupForm.reset();
        },
        error: (error) => {
          console.error('Error restoring backup:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to restore backup.', key: 'tl' });
        }
      })
    }
  }


  confirmRestoreBackup(): void {
    if (this.backupForm.invalid) {
      this.markTouched('selectedBackup');
      return;
    }
    const selectedBackup = this.backupForm.value.selectedBackup;
    this.confirmationService.confirm({
      header: 'Restore Backup?',
      message: `Are you sure you want to restore the backup '${selectedBackup}'?`,
      accept: () => {
        this.restoreBackup();
      }
    });
  }

  // restoreBackup(): void {
  //   if (this.selectedBackup) {
  //     this.backupService.restoreBackup(this.selectedBackup).subscribe({
  //       next: () => {
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Backup restored successfully.', key: 'tl' });
  //         this.restoreAttempted = false;
  //       },
  //       error: (error) => {
  //         console.error('Error restoring backup:', error);
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to restore backup.', key: 'tl' });
  //       }
  //     });
  //   }
  // }


  // confirmRestoreBackup(): void {
  //   this.restoreAttempted = true;
  //   if (!this.selectedBackup) {
  //     return;
  //   }
  //   this.confirmationService.confirm({
  //     message: `Are you sure you want to restore the backup '${this.selectedBackup}'?`,
  //     accept: () => {
  //       this.restoreBackup();
  //     }
  //   });
  // }

}
