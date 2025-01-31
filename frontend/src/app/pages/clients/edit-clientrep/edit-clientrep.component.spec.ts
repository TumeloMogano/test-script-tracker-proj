import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClientrepComponent } from './edit-clientrep.component';

describe('EditClientrepComponent', () => {
  let component: EditClientrepComponent;
  let fixture: ComponentFixture<EditClientrepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditClientrepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditClientrepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
