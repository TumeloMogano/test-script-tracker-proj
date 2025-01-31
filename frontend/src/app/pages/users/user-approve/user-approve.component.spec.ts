import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserApproveComponent } from './user-approve.component';

describe('UserApproveComponent', () => {
  let component: UserApproveComponent;
  let fixture: ComponentFixture<UserApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserApproveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
