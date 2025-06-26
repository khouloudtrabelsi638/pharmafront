import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-branding',
  template: `
    <a href="/" class="logodark" style="display: flex; justify-content: center; align-items: center; height: 100%;">

      <img
        src="./assets/images/logos/logo.png"
        class="align-middle m-2"
        alt="logo"
        height="50"
        width="200"
      style="display: block;"
      />
    </a>
  `,
})
export class BrandingComponent {
  options = this.settings.getOptions();
  constructor(private settings: CoreService) {}
}
