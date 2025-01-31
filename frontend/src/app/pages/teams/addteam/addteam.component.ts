import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '../../../services/teams/team.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-addteam',
  templateUrl: './addteam.component.html',
  styleUrls: ['./addteam.component.scss']
})
export class AddteamComponent implements OnInit{
  createTeamForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private teamService: TeamService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService 
  ) {
    this.createTeamForm = this.formBuilder.group({
      teamName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      teamDescription: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {}

  saveTeam(): void {
    if (this.createTeamForm.valid) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to create this team?',
        header: 'Create Team?', 
        accept: () => {
          const newTeam = {
            teamId: '', 
            teamName: this.createTeamForm.get('teamName')?.value,
            teamDescription: this.createTeamForm.get('teamDescription')?.value,
            creationDate: new Date() 
          };

          this.teamService.createTeam(newTeam).subscribe(() => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Team Created successfully', key: 'bc' });
            this.router.navigate(['/teams']);
          }, error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Create Team', key: 'bc' });
          });
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      this.createTeamForm.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Validation Error', detail: 'Please fill in all required fields', key: 'bc' });
    }
  }

  goBack(): void {
    this.router.navigate(['/teams']);
  }

  cancel(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel?',
      header: 'Cancel Team Creation?',  
      accept: () => {
        this.router.navigate(['/teams']);
      }
    });
  }

  // Getter for easy access to form fields in the template
  get f() { return this.createTeamForm.controls; }
}
