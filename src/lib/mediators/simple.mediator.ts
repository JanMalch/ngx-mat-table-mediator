import { MatPaginator, MatSort, MatTable, SortDirection } from '@angular/material';
import { Observable } from 'rxjs';
import { MatTableMediator } from '../mat-table.mediator';
import {
  MediatedFetchFunction,
  MediatorConfig,
  MediatorData,
  TriggerPayload
} from '../models';

/**
 * A simple implementation of `MatTableMediator` that takes the `fetch` function as an `constructor` argument.
 * Any calls to the `fetch` method of this class, will be forwarded to the specified function from the `constructor`.
 * @typeparam F type of the trigger payload to be used in the underlying `fetch` function, for example a form output
 * @typeparam O type of the output data for the table. This must match MatTable's generic type
 */
export class SimpleTableMediator<F, O> extends MatTableMediator<F, O> {
  constructor(
    protected fetchFn: MediatedFetchFunction<F, O>,
    protected trigger$: TriggerPayload<F>,
    table: MatTable<O>,
    paginator: MatPaginator,
    sort: MatSort,
    config: Partial<MediatorConfig<O>> = {}
  ) {
    super(table, paginator, sort, config);
  }

  fetch(
    payload?: F,
    sortBy?: string,
    sortDirection?: SortDirection,
    pageIndex?: number,
    pageSize?: number
  ): Observable<MediatorData<O>> {
    return this.fetchFn(payload, sortBy, sortDirection, pageIndex, pageSize);
  }
}
