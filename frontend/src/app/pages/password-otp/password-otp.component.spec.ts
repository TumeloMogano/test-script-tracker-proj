import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordOTPComponent } from './password-otp.component';

describe('PasswordOTPComponent', () => {
  let component: PasswordOTPComponent;
  let fixture: ComponentFixture<PasswordOTPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordOTPComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordOTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
