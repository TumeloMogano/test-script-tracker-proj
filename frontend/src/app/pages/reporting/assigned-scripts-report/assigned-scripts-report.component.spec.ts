import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedScriptsReportComponent } from './assigned-scripts-report.component';

describe('AssignedScriptsReportComponent', () => {
  let component: AssignedScriptsReportComponent;
  let fixture: ComponentFixture<AssignedScriptsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignedScriptsReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignedScriptsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
