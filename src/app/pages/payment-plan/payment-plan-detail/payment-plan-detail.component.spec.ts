import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPlanDetailComponent } from './payment-plan-detail.component';

describe('PaymentPlanDetailComponent', () => {
  let component: PaymentPlanDetailComponent;
  let fixture: ComponentFixture<PaymentPlanDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentPlanDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentPlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
