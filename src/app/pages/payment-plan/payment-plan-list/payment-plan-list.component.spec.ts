import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPlanListComponent } from './payment-plan-list.component';

describe('PaymentPlanListComponent', () => {
  let component: PaymentPlanListComponent;
  let fixture: ComponentFixture<PaymentPlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentPlanListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
