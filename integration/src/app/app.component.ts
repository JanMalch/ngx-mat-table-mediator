import { Component } from '@angular/core';
import { MinimalComponent } from './minimal/minimal.component';
import { CustomComponent } from './custom/custom.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly tabs = [
    {
      component: MinimalComponent,
      label: 'Minimal',
      source: 'minimal/minimal.component.ts'
    },
    {
      component: CustomComponent,
      label: 'Custom',
      source: 'custom/custom.component.ts'
    }
  ];

  readonly prefix =
    'https://github.com/JanMalch/ngx-mat-table-mediator/tree/master/integration/src/app/';
}
