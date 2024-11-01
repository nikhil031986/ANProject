import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPOPUPComponent } from './payment-popup.component';

describe('PaymentPOPUPComponent', () => {
  let component: PaymentPOPUPComponent;
  let fixture: ComponentFixture<PaymentPOPUPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentPOPUPComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentPOPUPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
