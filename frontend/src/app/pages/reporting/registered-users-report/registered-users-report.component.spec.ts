import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredUsersReportComponent } from './registered-users-report.component';

describe('RegisteredUsersReportComponent', () => {
  let component: RegisteredUsersReportComponent;
  let fixture: ComponentFixture<RegisteredUsersReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisteredUsersReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisteredUsersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
