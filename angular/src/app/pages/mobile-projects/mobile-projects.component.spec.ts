import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileProjectsComponent } from './mobile-projects.component';

describe('MobileProjectsBoxComponent', () => {
  let component: MobileProjectsComponent;
  let fixture: ComponentFixture<MobileProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileProjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
