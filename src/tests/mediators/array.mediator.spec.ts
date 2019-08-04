import { EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTable, PageEvent, Sort } from '@angular/material';
import { BehaviorSubject, of } from 'rxjs';
import {
  ArrayTableMediator,
  MatTableMediator,
  MediatorConfig,
  MediatorData,
  prepareMediatorData
} from '../../public-api';

describe('ArrayTableMediator', () => {
  let mediator: MatTableMediator<void, string>;
  const fetchFn = (payload, sortBy, sortDirection, pageIndex, pageSize) => of(['A', 'B', 'C']);

  const config: Partial<MediatorConfig<string>> = { debounceLoading: 0 };
  let matTable: MatTable<string>;
  let matSort: MatSort;
  let matPaginator: MatPaginator;
  let trigger$;

  beforeEach(() => {
    trigger$ = new BehaviorSubject<void>(undefined);
    matTable = {} as any;
    matSort = {
      sortChange: new EventEmitter<Sort>()
    } as any;
    matPaginator = {
      page: new EventEmitter<PageEvent>()
    } as any;

    mediator = new ArrayTableMediator(
      fetchFn,
      trigger$,
      matTable,
      matPaginator,
      matSort,
      config
    );
  });

  it('should pass the data to the material elements', () => {
    mediator.start();
    expect(matTable.dataSource).toEqual(['A', 'B', 'C']);
    expect(matPaginator.length).toBe(3);
  });
});

describe('prepareMediatorData', () => {
  it('should paginate', () => {
    const mediatorData: MediatorData<string> = {
      data: ['A', 'B', 'C', 'D', 'E', 'F'],
      total: 6
    };
    const actual = prepareMediatorData(mediatorData, undefined, undefined, 1, 2);
    const expected: MediatorData<string> = {
      data: ['C', 'D'],
      total: 6
    };
    expect(actual).toEqual(expected);
  });

  it('should sort', () => {
    const mediatorData: MediatorData<{ id: number }> = {
      data: new Array(3).fill(0).map((_, i) => ({ id: i })),
      total: 3
    };
    const actual = prepareMediatorData(mediatorData, 'id', 'desc', undefined, undefined);
    const expected: MediatorData<{ id: number }> = {
      data: new Array(3)
        .fill(0)
        .map((_, i) => ({ id: i }))
        .reverse(),
      total: 3
    };
    expect(actual).toEqual(expected);
  });

  it('should leave unchanged if all undefined', () => {
    const mediatorData: MediatorData<string> = {
      data: ['A', 'B', 'C', 'D', 'E', 'F'],
      total: 6
    };
    const actual = prepareMediatorData(mediatorData);
    const expected: MediatorData<string> = {
      data: ['A', 'B', 'C', 'D', 'E', 'F'],
      total: 6
    };
    expect(actual).toEqual(expected);
  });
});
