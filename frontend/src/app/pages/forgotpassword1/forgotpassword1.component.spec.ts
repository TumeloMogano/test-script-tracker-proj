import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forgotpassword1Component } from './forgotpassword1.component';

describe('Forgotpassword1Component', () => {
  let component: Forgotpassword1Component;
  let fixture: ComponentFixture<Forgotpassword1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Forgotpassword1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Forgotpassword1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
