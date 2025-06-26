import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierFormModalComponent } from './dossier-form-modal.component';

describe('DossierFormModalComponent', () => {
  let component: DossierFormModalComponent;
  let fixture: ComponentFixture<DossierFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DossierFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DossierFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
