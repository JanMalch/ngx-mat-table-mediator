import { MatPaginator, MatSort, MatTable, SortDirection } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatTableMediator } from '../mat-table.mediator';
import { ArrayFetchFunction, MediatorConfig, MediatorData, TriggerPayload } from '../models';

/**
 * A simple implementation of `MatTableMediator` that takes the `fetch` function as an `constructor` argument.
 * Any calls to the `fetch` method of this class, will be forwarded to the specified function from the `constructor`.
 * The result will be transformed via the `prepareMediatorData` function.
 * @typeparam F type of the trigger payload to be used in the underlying `fetch` function, for example a form output
 * @typeparam O type of the output data for the table. This must match MatTable's generic type
 * @see [[prepareMediatorData]]
 */
export class ArrayTableMediator<F, O> extends MatTableMediator<F, O> {
  constructor(
    protected fetchFn: ArrayFetchFunction<F, O>,
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
    return this.fetchFn(payload, sortBy, sortDirection, pageIndex, pageSize).pipe(
      map(data =>
        prepareMediatorData(
          { data, total: data.length },
          sortBy,
          sortDirection,
          pageIndex,
          pageSize
        )
      )
    );
  }
}

/**
 * This function attempts to sort and paginate the received mediator data,
 * with the given parameters.
 * @param mediatorData the received mediator data
 * @param sortBy the currently selected column
 * @param sortDirection `"asc"`, `"desc"` or `""`
 * @param pageIndex the current page the user is on
 * @param pageSize the given page size by the user
 */
export function prepareMediatorData<O>(
  mediatorData: MediatorData<O>,
  sortBy?: string,
  sortDirection?: SortDirection,
  pageIndex?: number,
  pageSize?: number
) {
  const data = [...mediatorData.data];
  if (sortDirection != null && sortBy != null && sortDirection !== '') {
    data.sort((a, b) => {
      const cmp = a[sortBy] < b[sortBy] ? -1 : 1;
      const direction = sortDirection === 'desc' ? -1 : 1;
      return direction * cmp;
    });
  }
  if (pageIndex != null && pageSize > 0) {
    return {
      data: data.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
      total: mediatorData.total
    };
  }
  return {
    data,
    total: mediatorData.total
  };
}
