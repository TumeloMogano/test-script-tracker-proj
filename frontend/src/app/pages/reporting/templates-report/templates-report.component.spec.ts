import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesReportComponent } from './templates-report.component';

describe('TemplatesReportComponent', () => {
  let component: TemplatesReportComponent;
  let fixture: ComponentFixture<TemplatesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplatesReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplatesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
