import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingCompanyBoxComponent } from './working-company-box.component';

describe('WorkingCompabyBoxComponent', () => {
  let component: WorkingCompanyBoxComponent;
  let fixture: ComponentFixture<WorkingCompanyBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkingCompanyBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingCompanyBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
