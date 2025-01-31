import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPhaseReportComponent } from './project-phase-report.component';

describe('ProjectPhaseReportComponent', () => {
  let component: ProjectPhaseReportComponent;
  let fixture: ComponentFixture<ProjectPhaseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectPhaseReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectPhaseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
