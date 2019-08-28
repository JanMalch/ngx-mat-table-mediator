import {
  AfterViewInit,
  Component,
  ContentChild,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { MatColumnDef } from '@angular/material';
import { Observable } from 'rxjs';
import { MediatorProxy } from '../di/mediator-proxy.service';
import { Columns } from '../models';
import { LoadingMarkerDirective } from './loading-marker.directive';
import { MediatedTableComponent } from './mediated-table-component';

@Component({
  selector: 'mtm-table[columns][labels]',
  templateUrl: './mtm-table.component.html',
  providers: [MediatorProxy],
  encapsulation: ViewEncapsulation.None
})
export class MtmTableComponent<F, O> extends MediatedTableComponent<F, O>
  implements AfterViewInit {
  @Input('columns') set _columns(value: string | Columns<O>) {
    this.cachedLabels = null;
    this.columns = (typeof value === 'string' ? value.split(/, | |,/g) : value) as Columns<O>;
  }

  // TODO: refactor to common input strategy
  @Input('labels') set _labels(value: string | string[]) {
    this.parsedLabels = typeof value === 'string' ? value.split(/, | |,/g) : value;
  }

  @Input() sortable = true;
  @Input('allColumns') _allColumns = [];

  private parsedLabels: string[];
  private cachedLabels: { [col: string]: string } = null;

  private projectedColumns = [];

  get allColumns(): string[] {
    return Array.from(
      new Set([
        ...this.columns,
        ...this._allColumns.filter(
          c => this.columns.includes(c) || this.projectedColumns.includes(c)
        )
      ] as string[])
    );
  }

  get labels(): { [col: string]: string } {
    if (this.cachedLabels == null) {
      this.cachedLabels = this.columns.reduce((acc, curr, index) => {
        acc[curr as string] = this.parsedLabels[index] || '';
        return acc;
      }, {});
    }
    return this.cachedLabels;
  }

  columns: Columns<O>;

  @ContentChild(LoadingMarkerDirective) marker: LoadingMarkerDirective;

  get withLoadingIndicator(): boolean {
    return this.marker != null;
  }

  isLoading$: Observable<boolean>;

  constructor(public proxy: MediatorProxy<F, O>) {
    super();
  }

  addColumn(def: MatColumnDef) {
    if (this.projectedColumns.includes(def.name)) {
      return;
    }
    this.projectedColumns.push(def.name);
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.isLoading$ = this.proxy.isLoading$;
  }
}
