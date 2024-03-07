import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileTaskListComponent } from './mobile-task-list.component';

describe('MobileTaskListComponent', () => {
  let component: MobileTaskListComponent;
  let fixture: ComponentFixture<MobileTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileTaskListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
