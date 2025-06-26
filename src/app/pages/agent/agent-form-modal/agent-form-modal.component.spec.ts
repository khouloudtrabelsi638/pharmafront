import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentFormModalComponent } from './agent-form-modal.component';

describe('AgentFormModalComponent', () => {
  let component: AgentFormModalComponent;
  let fixture: ComponentFixture<AgentFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
