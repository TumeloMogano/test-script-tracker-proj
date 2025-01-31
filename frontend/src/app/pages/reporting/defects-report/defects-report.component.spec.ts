import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectsReportComponent } from './defects-report.component';

describe('DefectsReportComponent', () => {
  let component: DefectsReportComponent;
  let fixture: ComponentFixture<DefectsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefectsReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DefectsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
