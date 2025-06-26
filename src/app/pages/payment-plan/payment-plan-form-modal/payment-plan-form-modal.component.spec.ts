import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPlanFormModalComponent } from './payment-plan-form-modal.component';

describe('PaymentPlanFormModalComponent', () => {
  let component: PaymentPlanFormModalComponent;
  let fixture: ComponentFixture<PaymentPlanFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentPlanFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentPlanFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
