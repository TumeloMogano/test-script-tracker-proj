import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClientrepComponent } from './add-clientrep.component';

describe('AddClientrepComponent', () => {
  let component: AddClientrepComponent;
  let fixture: ComponentFixture<AddClientrepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddClientrepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddClientrepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
