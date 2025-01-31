import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestscriptListComponent } from './testscript-list.component';

describe('TestscriptListComponent', () => {
  let component: TestscriptListComponent;
  let fixture: ComponentFixture<TestscriptListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestscriptListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestscriptListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
