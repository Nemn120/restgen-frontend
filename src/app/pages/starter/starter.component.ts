import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-starter',
  imports: [
    MaterialModule,
  ],
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent { }
