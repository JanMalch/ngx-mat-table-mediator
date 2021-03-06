import { EventEmitter, OnDestroy } from '@angular/core';
import {
  MatPaginator,
  MatSort,
  MatTable,
  PageEvent,
  Sort,
  SortDirection
} from '@angular/material';
import { BehaviorSubject, combineLatest, merge, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  filter,
  mapTo,
  mergeMap,
  retry,
  startWith,
  takeUntil
} from 'rxjs/operators';
import { instanceOfMediatorData } from './functions';
import { Column, MediatorConfig, MediatorData, TriggerPayload } from './models';

// tslint:disable:variable-name
/**
 * This mediator class takes care of connecting and managing an Angular Material table with pagination, sorting and data from an observable.
 * It takes care of:
 * - firing the `fetch` function when the `trigger$`, sorting or page changes
 * - resetting page index to 0, if `trigger$` or sorting changes
 * - error handling (retries or emits error$ and returns empty data array)
 * - indicating loading
 * - completing all observables, if ngOnDestroy() is called
 *
 * After creating an object of the mediator and calling the `start` method,
 * it will automatically be ready to load the data, as soon as the `trigger$` observable emits.
 *
 * @typeparam F type of the trigger payload to be used in the underlying `fetch` function, for example a form output
 * @typeparam O type of the output data for the table. This must match MatTable's generic type
 * @see [[start]]
 */
// @dynamic
export abstract class MatTableMediator<F, O> implements OnDestroy {
  /**
   * The default config for mediators.
   * ```typescript
   * {
   *   trackByFn: index => index, // track by index
   *   attempts: 0,               // do not retry
   *   debounceLoading: 150       // debounce loading indicator by 150ms
   * }
   * ```
   * @see [[MediatorConfig]]
   */
  static readonly DEFAULT_CONFIG: MediatorConfig<any> = {
    trackByFn: index => index,
    attempts: 0,
    debounceLoading: 150
  };

  /**
   * A subject for cleanups. Will be called and completed by the `ngOnDestroy` method.
   * @see [[ngOnDestroy]]
   */
  protected _destroy$ = new Subject<void>();
  /**
   * The raw MediatorData observable, resulting from the `createDataFetch` method.
   * @see [[createDataFetch]]
   * @see [[_data$]]
   */
  protected _mediatorData$: Observable<MediatorData<O>>;
  /**
   * The data from the MediatorData object.
   * It only contains the received entities and will be fed into the table.
   */
  protected _data$ = new Subject<Array<O>>();
  /**
   * The total result count, taken from the MediatorData object.
   */
  protected _totalResults$ = new Subject<number>();
  /**
   * The subject that receives any error from the fetching process.
   * @see [[handleError
   */
  protected _error$ = new Subject<Error>();
  /**
   * The BehaviorSubject indicating the loading status.
   */
  protected _loading$ = new BehaviorSubject<boolean>(false);

  /**
   * An observable that emits, whenever the page is reset.
   * To change the behaviour overwrite the `createOnPageReset` method.
   * @see [[createOnPageReset]]
   */
  public onPageReset$: Observable<[EventEmitter<Sort>, F] | any>;

  /**
   * the observable whose latest value always gets fed into the fetch function
   * If you don't need this please use the following example in your class
   * @example
   * protected trigger$ = of(undefined); // start instantly
   * protected trigger$ = new ReplaySubject<any>(1); // only on a button click
   * protected trigger$ = new BehaviourSubject<any>(undefined); // start instantly and on every other button click
   */
  protected abstract get trigger$(): TriggerPayload<F>;

  /**
   * A frozen `MediatorConfig`, put together in the constructor.
   * By default the `MatTableMediator.DEFAULT_CONFIG` values will be used.
   * @see [[MatTableMediator.DEFAULT_CONFIG]]
   */
  protected readonly config: MediatorConfig<O>;

  /**
   * Creates a new instance of a MatTableFetchMediator and calls its `ngOnInit` function.
   * @see [[MatTableMediator]]
   * @param table Reference to the MatTable
   * @param paginator Reference to the MatPaginator
   * @param sort Reference to the MatSort
   * @param [config={}] An optional config object
   */
  protected constructor(
    protected readonly table: MatTable<O>,
    protected readonly paginator?: MatPaginator,
    protected readonly sort?: MatSort,
    config: Partial<MediatorConfig<O>> = {}
  ) {
    this.config = Object.freeze({ ...MatTableMediator.DEFAULT_CONFIG, ...config });
    this.table.trackBy = this.config.trackByFn;
  }

  /**
   * safely returns `this.sort.sortChange.pipe(startWith({}))` or `of(undefined)`, if MatSort object wasn't provided
   */
  protected get sortChange$(): EventEmitter<Sort> {
    return !!this.sort ? this.sort.sortChange.pipe(startWith({})) : (of(undefined) as any);
  }

  /**
   * safely returns `this.sort.active` or `undefined`, if MatSort object wasn't provided
   */
  protected get sortActive(): Column<O> | undefined {
    return !!this.sort ? (this.sort.active as Column<O>) : undefined;
  }

  /**
   * safely returns `this.sort.direction` or `undefined`, if MatSort object wasn't provided
   */
  protected get sortDirection(): SortDirection | undefined {
    return !!this.sort ? this.sort.direction : undefined;
  }

  /**
   * safely returns `this.paginator.page.pipe(startWith({}))` or `of(undefined)`, if MatPaginator object wasn't provided
   */
  protected get page$(): EventEmitter<PageEvent | undefined> {
    return !!this.paginator
      ? this.paginator.page.pipe(
          startWith({
            pageIndex: 0,
            pageSize: this.paginator.pageSize,
            length: 0
          })
        )
      : (of(undefined) as any);
  }

  /**
   * safely returns `this.paginator.pageIndex` or `undefined`, if MatPaginator object wasn't provided
   */
  protected get pageIndex(): number | undefined {
    return !!this.paginator ? this.paginator.pageIndex : undefined;
  }

  /**
   * safely returns `this.paginator.pageSize` or `undefined`, if MatPaginator object wasn't provided
   */
  protected get pageSize(): number | undefined {
    return !!this.paginator ? this.paginator.pageSize : undefined;
  }

  /**
   * This function initialises the page reset and the fetch function, effectively starting the mediator.
   * It won't be called automatically. You may want to call it at the end of your subclass' constructor.
   *
   * ```typescript
   * this.onPageReset$ = this.createOnPageReset();
   * this.onPageReset$.subscribe(value => this.handlePageReset(value));
   * // within this method any errors will be forwarded to `handleError`
   * this._mediatorData$ = this.createDataFetch();
   * this._mediatorData$.subscribe(result => this.handleResult(result));
   * ```
   */
  start() {
    this.onPageReset$ = this.createOnPageReset();
    this.onPageReset$.subscribe(value => this.handlePageReset(value));
    this._mediatorData$ = this.createDataFetch();
    this._mediatorData$.subscribe(result => this.handleResult(result));
  }

  /**
   * The function which is used for communicating with the API.
   * @param payload the latest trigger payload
   * @param sortBy the currently selected column
   * @param sortDirection `"asc"`, `"desc"` or `""`
   * @param pageIndex the current page the user is on
   * @param pageSize the given page size by the user
   */
  abstract fetch(
    payload?: F,
    sortBy?: Column<O>,
    sortDirection?: SortDirection,
    pageIndex?: number,
    pageSize?: number
  ): Observable<MediatorData<O>>;

  /**
   * This function creates an internal observable to reset the paginator.
   * By default it merges `sortChange$` and the `trigger$` observable.
   * @see [[sortChange$]]
   * @see [[trigger$]]
   */
  protected createOnPageReset(): Observable<[EventEmitter<Sort>, F]> | Observable<any> {
    return merge(this.sortChange$, this.trigger$).pipe(takeUntil(this._destroy$));
  }

  /**
   * This is the mediator's core function and setups the logic.
   * It merges the relevant observables, starts the fetch function and maps the values to fit the mediator's needs.
   */
  protected createDataFetch(): Observable<MediatorData<O>> {
    return combineLatest(this.trigger$, this.sortChange$, this.page$).pipe(
      takeUntil(this._destroy$),
      mergeMap(([payload]) => {
        this._loading$.next(true);

        return this.fetch(
          payload,
          this.sortActive,
          this.sortDirection,
          this.pageIndex,
          this.pageSize
        ).pipe(
          retry(this.config.attempts),
          catchError(err => this.handleError(err))
        );
      })
    );
  }

  /**
   * Handler that gets called whenever the `onPageReset$` observable emits.
   * @param value the result of the `onPageReset$` observable
   * @see [[onPageReset$]]
   */
  protected handlePageReset(value: [EventEmitter<Sort>, F] | any) {
    if (!!this.paginator) {
      this.paginator.pageIndex = 0;
    }
  }

  /**
   * This function handles any errors that occur while fetching the data.
   * You can either safely handle the error and return replacement data or rethrow the error.
   * Throwing an error will complete the observable and would have to be started again by calling #initDataFetch
   * @param error The thrown error
   * @returns The replacement data as an observable (e.g. `return of({ total: -1, data: [] });`)
   */
  protected handleError(error: Error): Observable<MediatorData<O>> {
    this._error$.next(error);

    return of({
      total: -1,
      data: []
    });
  }

  /**
   * This function gets called every time new data was fetched. It's responsible for feeding the data into the table and paginator.
   * It also controls the subjects for the properties like data$, resultsLength$ and isLoading$
   * @param result the result of the fetchFn, already mapped to MediatorData<O>
   */
  protected handleResult(result: MediatorData<O>): void {
    if (!instanceOfMediatorData(result)) {
      throw new Error(
        'MatTableMediator // No "data" or "total" key found in result. ' +
          'Please add a mapper function, that returns a valid MediatorData object.\n' +
          'Result after mapping (stringified first 100 chars):\n' +
          JSON.stringify(result, null, 2).substring(0, 100)
      );
    }

    const { data, total } = result;

    this._totalResults$.next(total);
    this._data$.next(data);

    if (!!this.paginator) {
      this.paginator.length = total;
    }
    this.table.dataSource = data;

    this._loading$.next(false);
  }

  /**
   * An observable of the data, which gets fed into the table.
   * The mediator takes care of feeding the table. You can use this property for additional actions.
   */
  get data$(): Observable<Array<O>> {
    return this._data$.asObservable();
  }

  /**
   * An observable with the latest error.
   * It does **NOT** return undefined, when a fetch was successful.
   */
  get error$(): Observable<Error> {
    return this._error$.asObservable();
  }

  /**
   * An observable which indicates loading.
   * by default loading starts when the fetch function gets triggered and
   * ends when data was received and just before the table and paginator gets fed.
   */
  get isLoading$(): Observable<boolean> {
    const obs$ = this._loading$.asObservable();
    if (this.config.debounceLoading <= 0) {
      return obs$;
    } else {
      return obs$.pipe(debounceTime(this.config.debounceLoading));
    }
  }

  /**
   * An observable which emits the total count of results that are available on the server.
   * The mediator takes care of feeding the paginator. You can use this property for additional actions.
   */
  get totalResults$(): Observable<number> {
    return this._totalResults$.asObservable();
  }

  /**
   * Returns an observable which only emits if results were found.
   *
   * It's a filter for the resultsLength$ property with `x > 0`.
   */
  get onResultsFound$(): Observable<number> {
    return this._totalResults$.asObservable().pipe(filter(x => x > 0));
  }

  /**
   * An observable which only emits if no results were found.
   *
   * It's a filter for the resultsLength$ property with `x <= 0`.
   */
  get onNoResultsFound$(): Observable<void> {
    return this._totalResults$.asObservable().pipe(
      filter(x => x <= 0),
      mapTo(undefined)
    );
  }

  /**
   * An observable which only emits if loading has started.
   * You may use this to hide an error message or perform other actions.
   */
  get onFetchBegin$(): Observable<void> {
    return this._loading$.asObservable().pipe(
      filter(x => x),
      mapTo(undefined)
    );
  }

  /**
   * Completes all created observables so there are no memory leaks.
   *
   * **You have to call this manually!**
   */
  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
    this._data$.complete();
    this._error$.complete();
    this._loading$.complete();
    this._totalResults$.complete();
  }
}
