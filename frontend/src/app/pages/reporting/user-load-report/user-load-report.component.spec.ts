import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLoadReportComponent } from './user-load-report.component';

describe('UserLoadReportComponent', () => {
  let component: UserLoadReportComponent;
  let fixture: ComponentFixture<UserLoadReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserLoadReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserLoadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
