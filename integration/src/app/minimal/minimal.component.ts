import { AfterViewInit, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import {
  MediatedTableComponent,
  MediatorData,
  prepareMediatorData,
  SimpleTableMediator,
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
  columns = ['name', 'age'];

  constructor() {
    super(SimpleTableMediator);
  }

  fetch(
    payload?: void,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc' | '',
    pageIndex?: number,
    pageSize?: number
  ): Observable<MediatorData<Person>> {
    return of(mockPersonData(pageSize)).pipe(
      map(data => prepareMediatorData(data, sortBy, sortDirection, pageIndex, pageSize))
    );
  }
}
