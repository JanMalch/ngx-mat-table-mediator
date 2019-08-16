import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatPaginator, MatSort, MatTable } from '@angular/material';
import { Observable } from 'rxjs';
import { MediatorProxy } from '../di/mediator-proxy.service';
import { Columns } from '../models';
import { LoadingMarkerDirective } from './loading-marker.directive';

@Component({
  selector: 'mtm-mediated-table[columns][labels]',
  templateUrl: './mtm-table-sort-paginator.component.html',
  providers: [MediatorProxy],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['components.css']
})
export class MtmTableSortPaginatorComponent<F, O> implements AfterViewInit {
  @Input('columns') set _columns(value: string | Columns<O>) {
    this.cachedLabels = null;
    this.columns = (typeof value === 'string' ? value.split(/, | |,/g) : value) as Columns<O>;
  }

  // TODO: refactor to ColLabelTuples
  @Input('labels') set _labels(value: string | string[]) {
    this.parsedLabels = typeof value === 'string' ? value.split(/, | |,/g) : value;
  }

  @Input() sortable = true;
  @Input() selectable = false;
  @Output() mtmSelect = new EventEmitter<O[]>();

  private parsedLabels: string[];
  private cachedLabels: { [col: string]: string } = null;

  get allColumns(): string[] {
    if (this.selectable) {
      return ['mtm-select', ...(this.columns as string[])];
    } else {
      return this.columns as string[];
    }
  }

  get labels(): { [col: string]: string } {
    if (this.cachedLabels == null) {
      this.cachedLabels = this.columns.reduce((acc, curr, index) => {
        acc[curr as string] = this.parsedLabels[index];
        return acc;
      }, {});
    }
    return this.cachedLabels;
  }

  data: O[] = [];

  columns: Columns<O>;

  /**
   * Queried `@ViewChild` table element
   */
  @ViewChild(MatTable) table: MatTable<O>;
  /**
   * Queried `@ViewChild` paginator, may be `undefined`
   * if no paginator is in the template
   */
  @ContentChild(MatPaginator) paginator?: MatPaginator;
  /**
   * Queried `@ViewChild` sort directive, may be `undefined`
   * if no sort is in the template
   */
  @ViewChild(MatSort) sort?: MatSort;

  @ContentChild(LoadingMarkerDirective) marker: LoadingMarkerDirective;

  get withLoadingIndicator(): boolean {
    return this.marker != null;
  }

  isLoading$: Observable<boolean>;
  selection = new SelectionModel<O>(true, []);

  constructor(public mediatorProxy: MediatorProxy<F, O>) {}

  ngAfterViewInit() {
    this.mediatorProxy.mtmAfterViewInit({
      table: this.table,
      paginator: this.paginator,
      sort: this.sort
    });
    this.isLoading$ = this.mediatorProxy.mediator.isLoading$;
    this.mediatorProxy.mediator.data$.subscribe(d => (this.data = d));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  async masterToggle() {
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
