import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveProjectsReportComponent } from './active-projects-report.component';

describe('ActiveProjectsReportComponent', () => {
  let component: ActiveProjectsReportComponent;
  let fixture: ComponentFixture<ActiveProjectsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActiveProjectsReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActiveProjectsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
