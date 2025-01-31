import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegisteroptionComponent } from './user-registeroption.component';

describe('UserRegisteroptionComponent', () => {
  let component: UserRegisteroptionComponent;
  let fixture: ComponentFixture<UserRegisteroptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRegisteroptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserRegisteroptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
