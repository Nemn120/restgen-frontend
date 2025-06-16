import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  imports: [RouterModule],
  template: `
    <a [routerLink]="['/']">
  <div style="display: flex; justify-content: center; align-items: center; width: 100%;">
    <img
      src="./assets/images/logos/logo.jpg"
      alt="logo"
      width="150px"
      style="display: block;"
    />
  </div>
</a>
  `,
})
export class BrandingComponent {
  options = this.settings.getOptions();
  constructor(private settings: CoreService) { }
}
