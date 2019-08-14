import { AfterViewInit, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { SortDirection } from '@angular/material';
import {
  applyPagination,
  applySorting,
  Column,
  Columns,
  MediatedTableComponent,
  MediatorData,
  MTM_TABLE_SORT_PAGINATOR_TMPL
} from 'ngx-mat-table-mediator';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { mockPersonData, Person } from '../models';

@Component({
  selector: 'app-minimal',
  template: MTM_TABLE_SORT_PAGINATOR_TMPL,
  styleUrls: ['./minimal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MinimalComponent extends MediatedTableComponent<void, Person>
  implements AfterViewInit, OnDestroy {
  columns: Columns<Person> = ['name'];

  constructor() {
    super();
  }

  fetch(
    payload?: void,
    sortBy?: Column<Person>,
    sortDirection?: SortDirection,
    pageIndex?: number,
    pageSize?: number
  ): Observable<MediatorData<Person>> {
    return of(mockPersonData(pageSize)).pipe(
      map(data => {
        const sorted = applySorting(data, sortBy, sortDirection);
        return applyPagination(sorted, pageIndex, pageSize);
      })
    );
  }
}
