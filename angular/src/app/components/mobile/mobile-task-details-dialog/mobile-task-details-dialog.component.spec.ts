import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileTaskDetailsDialogComponent } from './mobile-task-details-dialog.component';

describe('MobileTaskDetailsDialogComponent', () => {
  let component: MobileTaskDetailsDialogComponent;
  let fixture: ComponentFixture<MobileTaskDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileTaskDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileTaskDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
