import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestScriptStatusReportComponent } from './test-script-status-report.component';

describe('TestScriptStatusReportComponent', () => {
  let component: TestScriptStatusReportComponent;
  let fixture: ComponentFixture<TestScriptStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestScriptStatusReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestScriptStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
