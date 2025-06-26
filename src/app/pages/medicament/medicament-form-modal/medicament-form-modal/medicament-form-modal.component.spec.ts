import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentFormModalComponent } from './medicament-form-modal.component';

describe('MedicamentFormModalComponent', () => {
  let component: MedicamentFormModalComponent;
  let fixture: ComponentFixture<MedicamentFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicamentFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
