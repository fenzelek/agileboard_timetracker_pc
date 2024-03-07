import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileTasksFilterComponent } from './mobile-tasks-filter.component';

describe('MobileTasksFilterComponent', () => {
  let component: MobileTasksFilterComponent;
  let fixture: ComponentFixture<MobileTasksFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileTasksFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileTasksFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
