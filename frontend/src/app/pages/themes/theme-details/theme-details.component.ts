import { Component, OnInit, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../../services/theme/theme.service';
import { LogoService } from '../../../services/theme/logo.service';
import { ColourSchemeService } from '../../../services/theme/colourscheme.service';
import { ThemeDetails, Font, UpdateThemeDto } from '../../../models/theme';
import { Location } from '@angular/common';
import { MessageService, ConfirmationService } from 'primeng/api';
import * as bootstrap from 'bootstrap'; 
import { Permissions } from '../../../models/permissions.enums';
import { PermissionsService } from '../../../services/auth/permissions.service';

@Component({
  selector: 'app-theme-details',
  templateUrl: './theme-details.component.html',
  styleUrls: ['./theme-details.component.scss']
})
export class ThemeDetailsComponent implements OnInit, AfterViewChecked {
  themeId!: string;
  themeDetails!: ThemeDetails;
  logoBase64: string | null = null; 
  addLogoEnabled = false;
  addColourSchemeEnabled = false;
  fonts: Font[] = [];
  fontName: string | undefined;
  showLogos = true;
  showColourSchemes = true;
  themeForm!: FormGroup;
  submitted = false;
  logoError: string | null = null;
  logoFormErrors: { [key: string]: string } = {};
  @ViewChild('newColourPicker') newColourPicker!: ElementRef;
  colourError: string | null = null;

  isEditing = false;
  isUpdatingLogo = false;
  isUpdatingColour = false; 
  isAddingLogo = false; 
  isAddingColour = false;
  newColour: string = '#000000';
  numLogos: number = 0;
  numColours: number = 0;

  Permissions = Permissions;

  currentLogoId: string | null = null;
  currentColourSchemeId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private logoService: LogoService,
    private colourSchemeService: ColourSchemeService,
    private messageService: MessageService,
    private permissionService: PermissionsService,
    private confirmationService: ConfirmationService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('themeId');
    if (id) {
      this.themeId = id;
      this.loadThemeDetails(this.themeId);
      this.loadFonts();
    }
    this.initForm();
  }

  initForm() {
    this.themeForm = this.formBuilder.group({
      themeName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      fontSize: [14, [Validators.required, Validators.min(8), Validators.max(11)]],
      fontId: [null, Validators.required],
      clientId: [null, Validators.required]
    });
  }
  
  ngAfterViewChecked(): void {
    this.initializeTooltips();
  }

  initializeTooltips(): void {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
      if (!tooltipInstance){
        new bootstrap.Tooltip(tooltipTriggerEl);
      }
      
    });
  }

  hideTooltip(iconId: string): void {
    const tooltipElement = document.getElementById(iconId);
    if (tooltipElement) {
      const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipElement);
      if (tooltipInstance) {
        tooltipInstance.hide();
      }
    }
  }


  loadThemeDetails(themeId: string) {
    this.themeService.getThemeById(themeId).subscribe((data: ThemeDetails) => {
      this.themeDetails = data;
      this.setFontName();
      this.themeForm.patchValue({
        themeName: this.themeDetails.theme.themeName,
        fontSize: this.themeDetails.theme.fontSize,
        fontId: this.themeDetails.theme.fontId,
        clientId: this.themeDetails.theme.clientId
      });
      this.numLogos = this.themeDetails.themeLogos.length;
      this.numColours = this.themeDetails.themeColourSchemes.length;
      console.log('Loaded logos No.:', this.numLogos);
      console.log('Loaded colours No.:', this.numColours);

    });
  }

  loadFonts() {
    this.themeService.getAllFonts().subscribe((data: Font[]) => {
      this.fonts = data;
      this.setFontName();
    });
  }

  setFontName() {
    if (this.themeDetails && this.fonts.length > 0) {
      const font = this.fonts.find(f => f.fontId === this.themeDetails.theme.fontId);
      if (font) {
        this.fontName = font.fontName;
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/client', this.themeDetails.theme.clientId]);
  }

  onFileSelected(event: any, logoId?: string) {
    const file = event.target.files[0];
    
    if (file) {
      const fileSize = file.size / 1024 / 1024; //MB
      const fileType = file.type;
  
      if (fileSize > 1) {
        if (logoId) {
          this.logoFormErrors[logoId ? logoId : 'default'] = 'File size should not exceed 1 MB';
        } else {
          this.logoError = 'File size should not exceed 1 MB';
        }
        return;
      }
  
      if (!fileType.startsWith('image/')) {
        if (logoId) {
          this.logoFormErrors[logoId ? logoId : 'default'] = 'Only image files are allowed';
        } else {
          this.logoError = 'Only image files are allowed';
        }
        return;
      }
  
      if (logoId) {
        this.logoFormErrors[logoId ? logoId : 'default'] = '';
      } else {
        this.logoError = '';
      }
  
      const reader = new FileReader();
      reader.onload = () => {
        this.logoBase64 = reader.result as string;
        //this.displayLogo(this.logoBase64); // Display the logo immediately after file selection

      };
      reader.readAsDataURL(file);
    } else {
      if (logoId) {
        this.logoFormErrors[logoId] = 'Please select a file';
      } else {
        this.logoError = 'Please select a file';
      }
    }
  }

   // Utility function to convert HEX to RGB
   hexToRgb(hex: string): { r: number, g: number, b: number } {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }

  // Utility function to calculate luminance of a color
  calculateLuminance({ r, g, b }: { r: number, g: number, b: number }): number {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  // Validator function to check if the color is too dark
  isColorLight(colour: string): boolean {
    const rgb = this.hexToRgb(colour);
    const luminance = this.calculateLuminance(rgb);
    return luminance >= 128; // Threshold to consider color as light
  }
  
  addLogo() {
    this.logoError = ''; // Clear any previous error before starting the process

    if (!this.logoBase64) {
      this.logoError = 'Please select a valid image file';
      return;
    }

    this.confirmationService.confirm({
      header: 'Confirm Addition',
      message: 'Are you sure you want to add this logo?',
      accept: () => {
        if (this.logoBase64) {
          this.logoService.addLogo(this.themeId, { logoImage: this.logoBase64, themeId: this.themeId }).subscribe(() => {
            this.loadThemeDetails(this.themeId);
            this.cancelAddLogo(); 
            //window.location.reload();
            this.messageService.add({ severity: 'success', summary: 'Added', detail: 'Logo added successfully', key: 'bc' });
          }, error => {
            //window.location.reload();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add logo', key: 'bc' });
          });
        } else {
          this.logoError = 'Please select a valid image file';
        }
      },
      reject: () => {
      }
    });
  }
  
  updateLogo() {
    this.logoFormErrors[this.currentLogoId ? this.currentLogoId: 'default'] = ''; // Clear previous errors

    if (!this.logoBase64) {
      this.logoFormErrors[this.currentLogoId ? this.currentLogoId : 'default'] = 'Please select a valid image file';
      return;
    }
  
    if (!this.currentLogoId) {
      this.logoFormErrors['default'] = 'Invalid logo selection';
      return;
    }
  
    // Render the logo before displaying the message service
    this.displayLogo(this.logoBase64);

    this.confirmationService.confirm({
      header: 'Confirm Update',
      message: 'Are you sure you want to update this logo?',
      accept: () => {
        if (this.logoBase64 && this.currentLogoId) {
          this.logoService.updateLogo(this.currentLogoId, { logoImage: this.logoBase64, themeId: this.themeId }).subscribe(() => {
            this.loadThemeDetails(this.themeId);
            //window.location.reload();
            this.cancelLogoUpdate();
            this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Logo updated successfully', key: 'bc' });
          }, error => {
            //window.location.reload();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update logo', key: 'bc' });
          });
        }
      },
      reject: () => {
      }
    });
  }

  addColourScheme(colour: string) {

        // Check if the color is too dark
        if (!this.isColorLight(colour)) {
          this.colourError = 'The selected color is too dark. Please choose a lighter color.';
          return; // Stop the process if the color is too dark
        }
        this.colourError = null; // Clear the error if color is valid

    this.confirmationService.confirm({
      header: 'Confirm Addition',
      message: 'Are you sure you want to add this colour scheme?',
      accept: () => {
        this.colourSchemeService.addColourScheme(this.themeId, { colour, themeId: this.themeId }).subscribe(() => {
          this.loadThemeDetails(this.themeId);
          this.cancelAddColour();
          //window.location.reload();
          this.messageService.add({ severity: 'success', summary: 'Added', detail: 'Colour scheme added successfully', key: 'bc' });
        }, error => {
          //window.location.reload();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add colour scheme', key: 'bc' });
        });
      },
      reject: () => {
      }
    });
  }

  updateColourScheme() {
    if (this.currentColourSchemeId !== null) { 
      const colour = this.themeDetails.themeColourSchemes.find(c => c.colourSchemeId === this.currentColourSchemeId)?.colour;
      if (colour) {
        // Check if the color is too dark
        if (!this.isColorLight(colour)) {
          this.colourError = 'The selected color is too dark. Please choose a lighter color.';
          return; // Stop the process if the color is too dark
        }
        this.colourError = null; // Clear the error if color is valid

        this.confirmationService.confirm({
          header: 'Confirm Update',
          message: `Are you sure you want to update this colour scheme to ${colour}?`,
          accept: () => {
            this.colourSchemeService.updateColourScheme(this.currentColourSchemeId!, { colour, themeId: this.themeId }).subscribe(() => {
              this.loadThemeDetails(this.themeId);
              this.cancelColourUpdate(); 
              this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Colour scheme updated successfully', key: 'bc' });
              //window.location.reload(); 
            }, error => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update colour scheme', key: 'bc' });
            });
          },
          reject: () => {
          }
        });
      }
    }
  }

  removeLogo(logoId: string) {
    this.confirmationService.confirm({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this logo?',
      accept: () => {
        this.logoService.removeLogo(logoId).subscribe(() => {
          this.loadThemeDetails(this.themeId);
          //window.location.reload();
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Logo deleted successfully', key: 'bc' });
        }, error => {
          //window.location.reload();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete logo', key: 'bc' });
        });
      },
      reject: () => {
      }
    });
  }

  removeColourScheme(colourSchemeId: string) {
    this.confirmationService.confirm({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this colour scheme?',
      accept: () => {
        this.colourSchemeService.removeColourScheme(colourSchemeId).subscribe(() => {
          this.loadThemeDetails(this.themeId);
          //window.location.reload();
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Colour scheme deleted successfully', key: 'bc' });
        }, error => {
          //window.location.reload();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete colour scheme', key: 'bc' });
        });
      },
      reject: () => {
      }
    });
  }

  displayLogo(logoImage: string) {
    const displayedLogo = document.getElementById('displayedLogo') as HTMLImageElement;
    if (displayedLogo) {
      displayedLogo.src = logoImage;
    }
  }

  enableAddLogo() {
    this.isAddingLogo = true;
  }

  cancelAddLogo() {
    this.isAddingLogo = false;
  }

  enableAddColour() {
    this.isAddingColour = true;
  }

  cancelAddColour() {
    this.isAddingColour = false;
  }

  enableLogoUpdate(logoId: string) {
    this.isUpdatingLogo = true;
    this.currentLogoId = logoId;
  }

  cancelLogoUpdate() {
    this.isUpdatingLogo = false;
    this.currentLogoId = null;
    this.logoFormErrors = {};
  }

  enableColourUpdate(colourSchemeId: string) {
    this.isUpdatingColour = true;
    this.currentColourSchemeId = colourSchemeId;
  }

  cancelColourUpdate() {
    this.isUpdatingColour = false;
    this.currentColourSchemeId = null;
    this.colourError = null;
  }

  enableEdit() {
    this.isEditing = true;
  }

  // cancelEdit() {
  //   this.isEditing = false;
  // }

  cancelEdit(): void {
    this.confirmationService.confirm({
      header: 'Cancel',
      message: 'Are you sure you want to cancel? All unsaved changes will be lost.',
      accept: () => {
        this.isEditing = false;     
      }
    });
  }

  updateTheme() {
    this.submitted = true;
    if (this.themeForm.valid) {
      const theme: UpdateThemeDto = {      
        themeName: this.themeForm.value.themeName,
        fontSize: this.themeForm.value.fontSize,
        clientId: this.themeDetails.theme.clientId,
        fontId: this.themeForm.value.fontId
      };
      this.confirmationService.confirm({
        header: 'Confirm Update',
        message: 'Are you sure you want to update this theme?',
        accept: () => {
          this.themeService.updateTheme(this.themeId, theme).subscribe({
            next: () => {
              this.isEditing = false;
              //window.location.reload();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Theme updated successfully', key: 'bc' });
            },
            error: (error) => {
              this.isEditing = false;
             // window.location.reload();
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update theme', key: 'bc' });
            }
          });
        },
        reject: () => {
        }
      });
    }
  }

  confirmDeleteTheme(themeId: string, clientId: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this theme? This will delete the linked logos and colours as well.',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteTheme(themeId, clientId);
      }
    });
  }

  deleteTheme(themeId: string, clientId: string): void {   
      this.themeService.deleteTheme(themeId).subscribe({
        next: () => {
          this.messageService.add({ 
                severity: 'success',
                summary: 'Success',
                detail: 'Theme deleted successfully',
                 key: 'bc'});
          this.router.navigate(['/client', this.themeDetails.theme.clientId]);
        },
        error: (error) => {
          console.error('Error deleting theme:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete theme', key: 'bc' });
        }      
      });
    
  }

  hasPermission(permission: Permissions): boolean {
    return this.permissionService.hasPermission(permission)
  }

}
