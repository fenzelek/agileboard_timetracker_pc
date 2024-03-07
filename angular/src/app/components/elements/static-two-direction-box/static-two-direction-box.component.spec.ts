import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticTwoDirectionBoxComponent } from './static-two-direction-box.component';

describe('StaticTwoDirectionBoxComponent', () => {
  let component: StaticTwoDirectionBoxComponent;
  let fixture: ComponentFixture<StaticTwoDirectionBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaticTwoDirectionBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticTwoDirectionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
