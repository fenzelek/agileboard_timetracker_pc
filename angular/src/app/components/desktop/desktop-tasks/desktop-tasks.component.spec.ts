import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopTasksComponent } from './desktop-tasks.component';

describe('DesktopTasksComponent', () => {
  let component: DesktopTasksComponent;
  let fixture: ComponentFixture<DesktopTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
