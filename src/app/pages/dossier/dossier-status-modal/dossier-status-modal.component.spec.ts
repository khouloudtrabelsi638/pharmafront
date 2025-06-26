import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierStatusModalComponent } from './dossier-status-modal.component';

describe('DossierStatusModalComponent', () => {
  let component: DossierStatusModalComponent;
  let fixture: ComponentFixture<DossierStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DossierStatusModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DossierStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
