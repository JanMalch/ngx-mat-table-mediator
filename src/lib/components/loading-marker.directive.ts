import { Directive, Input } from '@angular/core';

@Directive({ selector: '[mtmLoader]' })
export class LoadingMarkerDirective {
  @Input('mtmLoader') containerCssClass: 'backdrop' | 'bar' | string = 'backdrop';
}
