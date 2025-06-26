import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultMedicamentComponent } from './consult-medicament.component';

describe('ConsultMedicamentComponent', () => {
  let component: ConsultMedicamentComponent;
  let fixture: ComponentFixture<ConsultMedicamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultMedicamentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultMedicamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
