import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AgentFormMemoryService {
  private data: any = {};

  set(formValue: any) {
    this.data = { ...formValue };
  }

  get() {
    return this.data;
  }

  clear() {
    this.data = {};
  }
}
