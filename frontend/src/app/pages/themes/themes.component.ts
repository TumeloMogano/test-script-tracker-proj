import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../services/theme/theme.service';
import { Theme, Font } from '../../models/theme';
import { ThemeRequest } from '../../models/theme-request';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent implements OnInit {
  themes: Theme[] = [];
  fonts: Font[] = [];
  clientId: string;
  themeForm: FormGroup;
  submitted = false;
  logoBase64: string | null = null;
  logoError: string | null = null; 

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,    
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clientId = this.route.snapshot.paramMap.get('clientId')!;
    this.themeForm = this.formBuilder.group({
      themeName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      fontSize: [8, [Validators.required, this.fontSizeChangedValidator(), Validators.min(8), Validators.max(11)]],
      fontId: [null, Validators.required],
      logoImage: ['', [Validators.required, imageFileValidator()]],
      colour: ['#000000', [Validators.required, this.colorChangedValidator('#000000'), this.isColorLightValidator()]],
      clientId: [this.clientId, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadFonts();
  }

  goBack(): void {
    this.router.navigate(['/client', this.clientId]);
  }

  loadFonts() {
    this.themeService.getAllFonts().subscribe((data: Font[]) => {
      this.fonts = data;
    });
  }

  fontSizeChangedValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === 0) {
        return { fontSizeNotChanged: true };
      }
      return null;
    };
  }

  isColorLightValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hexColor = control.value;
      if (hexColor) {
        const rgb = this.hexToRgb(hexColor);
        const luminance = this.calculateLuminance(rgb);
        // If the luminance is below 128, the color is too dark
        if (luminance < 128) {
          return { colorTooDark: true };
        }
      }
      return null;
    };
  }

    // Convert HEX color to RGB
    hexToRgb(hex: string): { r: number, g: number, b: number } {
      const bigint = parseInt(hex.slice(1), 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
      };
    }
  
    // Calculate luminance
    calculateLuminance({ r, g, b }: { r: number, g: number, b: number }): number {
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024; //MB
      const fileType = file.type;

      if (fileSize > 1) {
        this.logoError = 'File size should not exceed 1 MB';
        this.themeForm.get('logoImage')?.setErrors({ invalidFileSize: true });
        return;
      }

      if (!fileType.startsWith('image/')) {
        this.logoError = 'Only image files (PNG, JPEG, JPG) are allowed';
        this.themeForm.get('logoImage')?.setErrors({ invalidFileType: true });
        return;
      }

      this.logoError = null;
      const reader = new FileReader();
      reader.onload = () => {
        this.logoBase64 = reader.result as string;
        this.themeForm.get('logoImage')?.setValue(this.logoBase64);
      };
      reader.readAsDataURL(file);
    } else {
      this.logoError = 'Please select a file';
      this.themeForm.get('logoImage')?.setErrors({ noFileSelected: true });
    }
  }

  createTheme(): void {
    this.submitted = true;
  
    if (this.themeForm.invalid) {
      this.themeForm.markAllAsTouched();
      console.error('Form is invalid');
      return;
    }
  
    const themeRequest: ThemeRequest = {
      theme: {
        themeName: this.themeForm.value.themeName,
        fontSize: this.themeForm.value.fontSize,
        clientId: this.themeForm.value.clientId,
        fontId: this.themeForm.value.fontId
      },
      logo: { logoImage: this.themeForm.value.logoImage },
      colourScheme: { colour: this.themeForm.value.colour }
    };
  
    this.confirmationService.confirm({
      header: 'Confirm Submission',
      message: 'Are you sure you want to create this theme?',
      accept: () => {
        this.themeService.createTheme(this.clientId, themeRequest).subscribe(
          response => {
            this.messageService.add({
              severity: 'success',
              summary: 'Submitted',
              detail: 'Theme created successfully',
              key: 'bc'
            });
            this.router.navigate(['/client', this.clientId]);
          },
          error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create theme',
              key: 'bc'
            });
          }
        );
      },
      reject: () => {
      }
    });
  }
  

  colorChangedValidator(defaultColor: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === defaultColor) {
        return { colorNotChanged: true };
      }
      return null;
    };
  }
}

export function imageFileValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value;
    if (file && file instanceof File) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        return { invalidFileType: true };
      }
    }
    return null;
  };
}

export function logoSizeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value;
    if (file && file instanceof File) {
      const fileSize = file.size / 1024 / 1024; //MB
      if (fileSize > 1) {
        return { fileSizeExceeded: true };
      }
    }
    return null;
  };
}