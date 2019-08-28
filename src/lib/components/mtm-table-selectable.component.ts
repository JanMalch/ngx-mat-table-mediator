import {SelectionModel} from '@angular/cdk/collections';
import {AfterViewInit, Component, ContentChild, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {MatColumnDef} from '@angular/material';
import {Observable} from 'rxjs';
import {MediatorProxy} from '../di/mediator-proxy.service';
import {Columns} from '../models';
import {LoadingMarkerDirective} from './loading-marker.directive';
import {MediatedTableComponent} from './mediated-table-component';

@Component({
  selector: 'mtm-selectable-table[columns][labels]',
  templateUrl: './mtm-table-selectable.component.html',
  providers: [MediatorProxy],
  encapsulation: ViewEncapsulation.None
})
export class MtmTableSelectableComponent<F, O> extends MediatedTableComponent<F, O> implements AfterViewInit {
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

  @Output() mtmSelect = new EventEmitter<O[]>();

  private parsedLabels: string[];
  private cachedLabels: { [col: string]: string } = null;

  private projectedColumns = [];

  get allColumns(): string[] {
    return Array.from(new Set(['mtm-select', ...this.columns, ...this._allColumns.filter(c => this.columns.includes(c) || this.projectedColumns.includes(c))]));
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

  data: O[] = [];

  columns: Columns<O>;

  @ContentChild(LoadingMarkerDirective) marker: LoadingMarkerDirective;

  get withLoadingIndicator(): boolean {
    return this.marker != null;
  }

  isLoading$: Observable<boolean>;
  selection = new SelectionModel<O>(true, []);

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
    this.proxy.data$.subscribe(d => (this.data = d));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.data.forEach(row => this.selection.select(row));
    this.mtmSelect.emit(this.selection.selected);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: O): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  selectRow(row: O) {
    this.selection.toggle(row);
    this.mtmSelect.emit(this.selection.selected);
  }
}
