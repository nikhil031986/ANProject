import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripepaymentComponent } from './stripepayment.component';

describe('StripepaymentComponent', () => {
  let component: StripepaymentComponent;
  let fixture: ComponentFixture<StripepaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripepaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StripepaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
