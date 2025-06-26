import { TestBed } from '@angular/core/testing';

import { AgentFormMemoryServiceService } from './agent-form-memory-service.service';

describe('AgentFormMemoryServiceService', () => {
  let service: AgentFormMemoryServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentFormMemoryServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
