import { EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTable, PageEvent, Sort } from '@angular/material';
import { combineLatest, of, Subject, throwError } from 'rxjs';
import { first, mapTo } from 'rxjs/operators';
import {
  instanceOfMediatorData,
  MatTableMediator,
  MediatorConfig,
  MediatorData,
  SimpleTableMediator
} from '../../public-api';

describe('SimpleTableMediator', () => {
  let mediator: MatTableMediator<void, string>;
  const fetchFunctions = {
    fetchFn: (payload, sortBy, sortDirection, pageIndex, pageSize) =>
      of({
        data: ['A', 'B', 'C'],
        total: 10
      }),
    errorFetchFn: () => throwError(new Error('Test'))
  };

  const config: Partial<MediatorConfig<string>> = { debounceLoading: 0 };
  let matTable: MatTable<string>;
  let matSort: MatSort;
  let matPaginator: MatPaginator;
  let trigger$;

  beforeEach(() => {
    spyOn(fetchFunctions, 'fetchFn').and.callThrough();
    spyOn(fetchFunctions, 'errorFetchFn').and.callThrough();

    trigger$ = new Subject<void>();
    matTable = {} as any;
    matSort = {
      sortChange: new EventEmitter<Sort>()
    } as any;
    matPaginator = {
      page: new EventEmitter<PageEvent>()
    } as any;

    mediator = new SimpleTableMediator(
      fetchFunctions.fetchFn,
      trigger$,
      matTable,
      matPaginator,
      matSort,
      config
    );
  });

  it('should call the given fetchFn', () => {
    expect(fetchFunctions.fetchFn).not.toHaveBeenCalled();
    mediator.start();
    expect(fetchFunctions.fetchFn).not.toHaveBeenCalled();
    trigger$.next(undefined);
    expect(fetchFunctions.fetchFn).toHaveBeenCalled();
  });

  it('should pass the data to the material elements', () => {
    mediator.start();
    trigger$.next(undefined);
    expect(matTable.dataSource).toEqual(['A', 'B', 'C']);
    expect(matPaginator.length).toBe(10);
  });

  it('should forward errors to the error$ observable', done => {
    mediator = new SimpleTableMediator(
      fetchFunctions.errorFetchFn,
      trigger$,
      matTable,
      matPaginator,
      matSort,
      config
    );
    mediator.start();
    combineLatest(mediator.error$, mediator.data$, mediator.totalResults$).subscribe(
      ([err, data, totalResults]) => {
        expect(err.message).toBe('Test');
        expect(data).toEqual([]);
        expect(totalResults).toBe(-1);
        done();
      }
    );

    trigger$.next(undefined);
  });

  it('should workout without sort and paginator', () => {
    mediator = new SimpleTableMediator(
      fetchFunctions.fetchFn,
      trigger$,
      matTable,
      undefined,
      undefined,
      config
    );
    mediator.start();
    trigger$.next(undefined);
    expect(matTable.dataSource).toEqual(['A', 'B', 'C']);
  });

  describe('events', () => {
    it('should trigger events on success', done => {
      mediator.start();
      combineLatest(
        mediator.data$,
        mediator.totalResults$,
        mediator.onResultsFound$,
        mediator.onFetchBegin$.pipe(mapTo('onFetchBegin$')),
        mediator.isLoading$
      )
        .pipe(first())
        .subscribe(initial => {
          expect(initial).toEqual([['A', 'B', 'C'], 10, 10, 'onFetchBegin$', true]);
          done();
        });

      trigger$.next(undefined);
    });

    it('should trigger events on errors', done => {
      mediator = new SimpleTableMediator(
        fetchFunctions.errorFetchFn,
        trigger$,
        matTable,
        matPaginator,
        matSort,
        config
      );
      mediator.start();
      combineLatest(
        mediator.data$,
        mediator.totalResults$,
        mediator.onNoResultsFound$.pipe(mapTo('onNoResultsFound$')),
        mediator.onFetchBegin$.pipe(mapTo('onFetchBegin$')),
        mediator.isLoading$
      )
        .pipe(first())
        .subscribe(initial => {
          expect(initial).toEqual([[], -1, 'onNoResultsFound$', 'onFetchBegin$', true]);
          done();
        });

      trigger$.next(undefined);
    });
  });
});

describe('instanceOfMediatorData', () => {
  it('should return true for valid objects', () => {
    const data: MediatorData<any> = {
      data: [],
      total: 10
    };
    expect(instanceOfMediatorData(data)).toBe(true);
  });

  it('should return false for invalid objects', () => {
    expect(
      instanceOfMediatorData({
        data: [],
        total_results: 10
      })
    ).toBe(false);
    expect(instanceOfMediatorData(null)).toBe(false);
    expect(instanceOfMediatorData(undefined)).toBe(false);
    expect(instanceOfMediatorData(['A', 'B'])).toBe(false);
  });
});
