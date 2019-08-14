import { TrackByFunction } from '@angular/core';
import { SortDirection } from '@angular/material';
import { Observable } from 'rxjs';

/**
 * type alias for an observable of F or undefined
 * @typeparam F type of the payload, same <F> as the mediator's
 */
export type TriggerPayload<F> = Observable<F>;

/**
 * A function alias that takes a payload, the current `sortBy` id, `sortDirection`,
 * the `pageIndex` and selected `pageSize`. The latters may be `undefined`, if no
 * paginator or sorting is used
 * @typeparam F type of the payload, same <F> as the mediator's
 * @typeparam O type of the fetch output, same <O> as the mediator's
 */
export type FetchFunction<F, O> = (
  payload?: F,
  sortBy?: Column<O>,
  sortDirection?: SortDirection,
  pageIndex?: number,
  pageSize?: number
) => Observable<MediatorData<O>>;

/**
 * Interface for the transformed API output so the mediator can feed the data in the table and observables.
 * generic is the type of the array with the table data, same <O> as the mediator's and MatTable's
 * @typeparam O type of the array with the table data, same <O> as the mediator's
 */
export interface MediatorData<O> {
  total: number;
  data: Array<O>;
}

/**
 * Config object to configure a table mediator.
 * @typeparam T entity type for the `TrackByFunction`
 * @see [[MatTableMediator.DEFAULT_CONFIG]]
 * @see [TrackByFunction](https://angular.io/api/core/TrackByFunction)
 */
export interface MediatorConfig<T> {
  /**
   * `trackBy` function for the table
   */
  trackByFn: TrackByFunction<T>;
  /**
   * number of retry attempts for the `fetch` function
   */
  attempts: number;
  /**
   * `debounce` time for the `isLoading$` observable
   */
  debounceLoading: number;
}

/**
 * alias for a type with a constructor
 */
export type Newable<T> = new (...args: any[]) => T;

/**
 * alias for an array with keys of O
 * @typeparam O type of the array with the table data, same <O> as the mediator's
 */
export type Columns<O> = Array<Column<O>>;

/**
 * alias for a single key of O
 * @typeparam O type of the array with the table data, same <O> as the mediator's
 */
export type Column<O> = keyof O;
