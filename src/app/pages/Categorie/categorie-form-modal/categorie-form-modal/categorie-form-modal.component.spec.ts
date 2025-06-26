import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieFormModalComponent } from './categorie-form-modal.component';

describe('CategorieFormModalComponent', () => {
  let component: CategorieFormModalComponent;
  let fixture: ComponentFixture<CategorieFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorieFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorieFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
