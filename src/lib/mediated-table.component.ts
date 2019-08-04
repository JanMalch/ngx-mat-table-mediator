import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTable, SortDirection } from '@angular/material';
import { Observable, of } from 'rxjs';
import { MatTableMediator } from './mat-table.mediator';
import { MediatorConfig, MediatorData, Newable, TriggerPayload } from './models';

/**
 * This component reduces all boilerplate code to the absolut minimum:
 * - defining the columns: `columns = ['name', 'age'];`
 * - defining the used mediator class: `constructor() { super(SimpleTableMediator); }`
 * - implementing the `fetch` function: `return this.http.get('my-endpoint');`
 *
 * It exposes the `mediator` instance, so you may hook into its events.
 * @typeparam F type of the trigger payload to be used in the underlying `fetch` function, for example a form output
 * @typeparam O type of the output data for the table. This must match MatTable's generic type
 */
export abstract class MediatedTableComponent<F, O> implements AfterViewInit, OnDestroy {
  /**
   * Queried `@ViewChild` table element
   */
  @ViewChild(MatTable) table: MatTable<O>;
  /**
   * Queried `@ViewChild` paginator, may be `undefined`
   * if no paginator is in the template
   */
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  /**
   * Queried `@ViewChild` sort directive, may be `undefined`
   * if no sort is in the template
   */
  @ViewChild(MatSort) sort?: MatSort;

  /**
   * the mediator instance, initialised in the `initMediator()` method
   */
  mediator: MatTableMediator<F, O>;
  /**
   * the config object for the mediator
   */
  mediatorConfig: Partial<MediatorConfig<O>> = {};
  /**
   * Observable for the current loading status. Will be pre-initialised in the constructor,
   * to prevent `ExpressionChangedAfterItHasBeenCheckedError`
   */
  isLoading$: Observable<boolean>;
  /**
   * `trigger$` Observable of type `<F>`. Defaults to immediately emitting `undefined`, via `of`
   */
  trigger$: TriggerPayload<F> = of(undefined);

  /**
   * array of column ids
   */
  abstract columns: string[];

  /**
   * The `initialIsLoading` param sets the initial value for isLoading$.
   * If your fetching (read: loading) starts in start and the initial value for isLoading$ is `false`,
   * you will get an `ExpressionChangedAfterItHasBeenCheckedError`! Use this parameter to prevent this error.
   * @param mediatorClass Class of the Mediator to use
   * @param initialIsLoading the initial value for isLoading$
   */
  protected constructor(
    private mediatorClass: Newable<MatTableMediator<F, O>>,
    initialIsLoading: boolean = true
  ) {
    this.isLoading$ = of(initialIsLoading);
  }

  /**
   * The fetch method that will be used by the mediator
   * @param payload the latest payload of the trigger$ observable
   * @param sortBy the current column id that is sorted by
   * @param sortDirection the current sort direction
   * @param pageIndex the current page index
   * @param pageSize the current page size
   */
  abstract fetch(
    payload?: F,
    sortBy?: string,
    sortDirection?: SortDirection,
    pageIndex?: number,
    pageSize?: number
  ): Observable<MediatorData<O> | Array<O> | any>;

  /**
   * Calls the `initMediator` method.
   */
  ngAfterViewInit() {
    this.initMediator();
  }

  /**
   * Wrapper to initialise the mediator in an async fashion.
   * This may be used to prevent `ExpressionChangedAfterItHasBeenCheckedError` in some cases.
   * Overwrite the `ngAfterViewInit` method and call this method.
   */
  initMediatorAsync(): Promise<void> {
    return Promise.resolve().then(() => this.initMediator());
  }

  /**
   * Initialises the mediator instance.
   * By default this will be called automatically with the `ngAfterViewInit` method.
   * It sets `this.isLoading$` observable to the `mediator.isLoading$` observable.
   */
  initMediator(): void {
    this.mediator = new this.mediatorClass(
      (payload, sortBy, sortDirection, pageIndex, pageSize) =>
        this.fetch(payload, sortBy, sortDirection, pageIndex, pageSize),
      this.trigger$,
      this.table,
      this.paginator,
      this.sort,
      { ...MatTableMediator.DEFAULT_CONFIG, ...this.mediatorConfig }
    );
    this.isLoading$ = this.mediator.isLoading$;
    this.mediator.start();
  }

  /**
   * Cleans up the mediator by calling `ngOnDestroy`.
   */
  ngOnDestroy(): void {
    this.mediator.ngOnDestroy();
  }
}
