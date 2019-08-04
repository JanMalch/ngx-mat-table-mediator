import { TrackByFunction } from '@angular/core';
import { SortDirection } from '@angular/material';
import { Observable } from 'rxjs';

/**
 * type alias for an observable of F or undefined
 * F &rarr; type of the trigger payload, same <F> as the mediator's
 * @typeparam F type of the payload, same <F> as the mediator's
 */
export type TriggerPayload<F> = Observable<F | undefined>;

/**
 * A function alias that takes a payload, the current `sortBy` id, `sortDirection`,
 * the `pageIndex` and selected `pageSize`. The latters may be `undefined`, if no
 * paginator or sorting is used
 * @typeparam F type of the payload, same <F> as the mediator's
 * @typeparam O type of the fetch output, same <O> as the mediator's
 */
export type FetchFunction<F, O> = (
  payload?: F,
  sortBy?: string,
  sortDirection?: SortDirection,
  pageIndex?: number,
  pageSize?: number
) => Observable<O>;

/**
 * Type alias for a function that fetches the data for the table
 * and returns objects of type `MediatorData<O>`.
 * @typeparam F type of the trigger payload, same <F> as the mediator's
 * @typeparam O type of the data, same <O> as the mediator's
 */
export type MediatedFetchFunction<F, O> = FetchFunction<F, MediatorData<O>>;

/**
 * Type alias for a function that fetches the data for the table
 * and returns objects of type `Array<O>`. The data still has to be mapped to
 * `MediatorData` in a later step.
 * @typeparam F type of the trigger payload, same <F> as the mediator's
 * @typeparam O type of the data, same <O> as the mediator's
 */
export type ArrayFetchFunction<F, O> = FetchFunction<F, Array<O>>;

/**
 * Interface for the transformed API output so the mediator can feed the data in the table and observables.
 * generic is the type of the array with the table data, same <O> as the mediator's and MatTable's
 * O &rarr; type of the array with the table data, same <O> as the mediator's
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
