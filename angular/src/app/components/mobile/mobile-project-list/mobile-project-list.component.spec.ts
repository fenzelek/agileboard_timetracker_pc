import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileProjectListComponent } from './mobile-project-list.component';

describe('MobileProjectListComponent', () => {
  let component: MobileProjectListComponent;
  let fixture: ComponentFixture<MobileProjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileProjectListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
