import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileTasksComponent } from './mobile-tasks.component';

describe('MobileTasksBoxComponent', () => {
  let component: MobileTasksComponent;
  let fixture: ComponentFixture<MobileTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
