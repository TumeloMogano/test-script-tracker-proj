import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestscriptsUpdateComponent } from './testscripts-update.component';

describe('TestscriptsUpdateComponent', () => {
  let component: TestscriptsUpdateComponent;
  let fixture: ComponentFixture<TestscriptsUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestscriptsUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestscriptsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
