import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { TestScript } from '../../../models/testscript/testscripts';
import { TestStep } from '../../../models/testscript/teststeps';
import { Defect } from '../../../models/testscript/defects';
import { TestScriptsServices } from '../../../services/testscripts/testscripts.services';
import { DefectsServices } from '../../../services/defects/defects.services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AspUsers } from '../../../models/aspusers';
import { AspUsersServices } from '../../../services/aspnetusers/aspnetusers';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-defects',
  templateUrl: './defects.component.html',
  styleUrl: './defects.component.scss'
})
export class DefectsComponent implements OnInit, AfterViewChecked{
  defect! : Defect;
  userDets!: AspUsers;
  isUser: boolean = false;
  showEditForm: boolean = false;
  initialFormValue: any;
  showModal: boolean = false;
  newDefect! : Defect;
  defectIds!: string;
  editForm = new FormGroup({
    defectDescription: new FormControl ('', [Validators.required, Validators.minLength(10), Validators.maxLength(150)]),
    defectId: new FormControl('', Validators.required),
  });
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public testScriptService: TestScriptsServices,
    public defectService: DefectsServices,
    public userService: AspUsersServices,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public fb: FormBuilder
  )
  { }

  ngOnInit(): void{
    const defectId = this.route.snapshot.paramMap.get('defectId');
    if (defectId){
      this.defectService.getDefect(defectId).subscribe((result) =>{
        this.defect = result;
        this.defectIds = defectId;
       //defectStatus check
      this.defect.inProgress = false;
      this.defect.isUnclosed = false;
      console.log('defectobject:', this.defect);
       if(this.defect.defectStatus == "In Progress"){ this.defect.inProgress = true;} // Prepare to resolve or unresolve
       if(this.defect.defectStatus == "Resolved"|| this.defect.defectStatus == "Unresolved"){ this.defect.isUnclosed = true;} // Prepare to close defect
       console.log(this.defect.inProgress );
       console.log(this.defect.isUnclosed );
      
       if (this.defect.defectImage != null){ this.defect.imageTrue =  true;}// Image exists
        this.editForm.patchValue({
          defectDescription: this.defect.defectDescription,
          defectId: this.defect.defectId,
        })
        this.initialFormValue = this.editForm.value;
        console.log(this.defect.userEmailAddress);
        console.log(this.isUser);

        //User Details
        if(this.defect.userEmailAddress != null){
          this.isUser = true;
        this.userService.getUserByEmail(this.defect.userEmailAddress).subscribe((user)=>
        {
          this.userDets = user;
        })
        }})
    }
    this.initializeTooltips();
  }

  ngAfterViewChecked(): void {
    this.initializeTooltips();
  }

  initializeTooltips(): void {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
      if (!tooltipInstance) {
        new bootstrap.Tooltip(tooltipTriggerEl);  // Only initialize if not already initialized
      }
    });
  }
  
  hideTooltip(iconId: string): void {
    const tooltipElement = document.getElementById(iconId);
    if (tooltipElement) {
      const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipElement);
      if (tooltipInstance) {
        tooltipInstance.hide();
        tooltipInstance.dispose();  // Dispose of the tooltip to fully remove it
      }
    }
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

updateDefect(): void{
  if (this.editForm.invalid) {
    this.editForm.markAllAsTouched(); 
    return;
  }

  if (!this.defect) {
    return;
  }
console.log(this.editForm.value.defectId);
console.log(this.editForm.value.defectDescription);
console.log(this.defectIds);
const text = this.editForm.value.defectDescription;
console.log(text);
  this.confirmationService.confirm({
    header: 'Confirm Update',
    message: 'Are you sure you want to update this defect?',
    accept: () => {
      console.log(text);
      if (text){
        this.defectService.updateDefects(this.defectIds, text).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Defect updated successfully',
            key: 'bc'
          });
          this.showModal = false;
          this.ngOnInit();
        },
        error => {
          console.error('Validation Errors:', error.error.errors); 
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update defect',
            key: 'bc'
          });
          this.showModal = false;
          this.ngOnInit();
        }
      );}
    },
    reject: () => {
      
    }
  });
}

  getFormattedDate(date: any): string {
    if (!date) {
      return '';
    }
  
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return '';
    }
  
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'long' });
    const year = dateObj.getFullYear();
  
    return `${day} ${month} ${year}`;
  }

  goBack(): void {
    this.router.navigate(['/testscript-update', this.defect.testScriptId]); 
  }

  closeDefect(): void {
    if (this.defect && this.defectIds) {
      this.confirmationService.confirm({
        header: 'Confirm',
        message: 'Are you sure you want to close this defect?',
        accept: () => {
          this.defectService.closeDefect(this.defectIds).subscribe(
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Closed',
                detail: 'Defect closed successfully',
                key: 'bc'
              });
              this.ngOnInit();
            },
            error => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to close defect',
                key: 'bc'
              });
            }
          );
        },
        reject: () => {
        }
      });
    }
  }

  resolveDefect(): void {
    if (this.defect && this.defectIds) {
      this.confirmationService.confirm({
        header: 'Confirm',
        message: 'Are you sure you want to resolve this defect?',
        accept: () => {
          this.defectService.resolveDefect(this.defectIds).subscribe(
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Resolved',
                detail: 'Defect resolved successfully',
                key: 'bc'
              });
              this.ngOnInit();
            },
            error => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to resolve defect',
                key: 'bc'
              });
            }
          );
        },
        reject: () => {
        }
      });
    }
  }
  unResolveDefect(): void {
    if (this.defect && this.defectIds) {
      this.confirmationService.confirm({
        header: 'Confirm',
        message: 'Are you sure you want to unresolve this defect?',
        accept: () => {
          this.defectService.unresolveDefect(this.defectIds).subscribe(
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Unresolved',
                detail: 'Defect unresolved successfully',
                key: 'bc'
              });
              this.ngOnInit();
            },
            error => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to unresolve defect',
                key: 'bc'
              });
            }
          );
        },
        reject: () => {
        }
      });
    }
  }

}
