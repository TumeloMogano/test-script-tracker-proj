import { Component, OnInit } from '@angular/core';
import { Team } from '../../../models/team/team.model';
import { TeamService } from '../../../services/teams/team.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.scss']
})
export class EditTeamComponent implements OnInit {
  editTeamForm: FormGroup;
  teamId: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private teamService: TeamService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { 
    this.editTeamForm = this.formBuilder.group({
      teamName: ['', Validators.required],
      teamDescription: ['', Validators.required],
      creationDate: [null]
    });
    this.teamId = this.route.snapshot.paramMap.get('teamId')!;
    console.log('EditTeamcomponent initialized with teamId: ${this.teamId}');
  }

  ngOnInit(): void {
    this.loadTeamData();
  }

  loadTeamData(): void {
    this.teamService.getTeamById(this.teamId).subscribe(team => {
      console.log('Fetched team: ', team);//Debuggin attempts, Is the appropriate team fetched?
      this.editTeamForm.patchValue({
        teamName: team.teamName,
        teamDescription: team.teamDescription,
        creationDate: team.creationDate ? new Date(team.creationDate).toISOString().substring(0, 10) : null
      });
        this.editTeamForm.get('creationDate')?.disable();
    }, error => {
      console.error('Error fetching teamdata:', error);//error handling to help debug
    });
  }


  confirmUpdate(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to update this team?',
      header: 'Confirm Update',
      accept: () => {
        this.updateTeam();
      }
    });
  }


  updateTeam(): void {
    if (this.editTeamForm.valid) {
      const updatedTeam: Team = {
        teamId: this.teamId,
        teamName: this.editTeamForm.get('teamName')?.value,
        teamDescription: this.editTeamForm.get('teamDescription')?.value,
        creationDate: this.editTeamForm.get('creationDate')?.value ? new Date(this.editTeamForm.get('creationDate')?.value) : null
      };

      this.teamService.updateTeam(this.teamId, updatedTeam).subscribe(() => {        
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Team Updated Successfully!', key: 'bc' });  
        this.router.navigate(['/team',this.teamId]);  
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Update Team', key: 'bc'});
      });
    } else {
      this.editTeamForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel?',
      header: 'Cancel Update?',
      accept: () => {
        this.router.navigate(['/team',this.teamId]);
      }
    });
  }

  get f() { return this.editTeamForm.controls; }
}
