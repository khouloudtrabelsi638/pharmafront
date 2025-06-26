import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFormModalComponent } from './payment-form-modal.component';

describe('PaymentFormModalComponent', () => {
  let component: PaymentFormModalComponent;
  let fixture: ComponentFixture<PaymentFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
