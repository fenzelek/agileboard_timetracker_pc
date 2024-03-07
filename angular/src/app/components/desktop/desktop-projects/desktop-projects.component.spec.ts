import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopProjectsComponent } from './desktop-projects.component';

describe('DesktopProjectsComponent', () => {
  let component: DesktopProjectsComponent;
  let fixture: ComponentFixture<DesktopProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopProjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
