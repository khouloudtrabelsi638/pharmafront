import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffecterDossiersModalComponent } from './affecter-dossiers-modal.component';

describe('AffecterDossiersModalComponent', () => {
  let component: AffecterDossiersModalComponent;
  let fixture: ComponentFixture<AffecterDossiersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffecterDossiersModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffecterDossiersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
