import { SortDirection } from '@angular/material';
import { Column, MediatorData } from './models';

/**
 * This function attempts to sort and paginate the received mediator data,
 * with the given parameters.
 * @param rawData the received data array
 * @param sortBy the currently selected column
 * @param sortDirection `"asc"`, `"desc"` or `""`
 * @param pageIndex the current page the user is on
 * @param pageSize the given page size by the user
 */
export function prepareMediatorData<O>(
  rawData: Array<O>,
  sortBy?: Column<O>,
  sortDirection?: SortDirection,
  pageIndex?: number,
  pageSize?: number
) {
  let transformed = transformToMediatorData(rawData);
  transformed = applySorting(transformed, sortBy, sortDirection);
  return applyPagination(transformed, pageIndex, pageSize);
}

/**
 * Turns an array into a MediatorData object.
 * The full array will be used for the data field and its length for the total field.
 * @param rawData a raw data array
 */
export function transformToMediatorData<O>(rawData: Array<O>): MediatorData<O> {
  return {
    total: rawData.length,
    data: [...rawData]
  };
}

/**
 * Applies pagination to the given mediator data, by slicing the data array.
 * The total field will remain unchanged
 * @param mediatorData a MediatorData object
 * @param pageIndex the current page index
 * @param pageSize the current page size
 */
export function applyPagination<O>(
  mediatorData: MediatorData<O>,
  pageIndex?: number,
  pageSize?: number
): MediatorData<O> {
  const data = [...mediatorData.data];
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

/**
 * Applies sorting to the given mediator data, by creating a copy and sorting it.
 * @param mediatorData a MediatorData object
 * @param sortBy field name to be sorted by
 * @param sortDirection current sort direction
 */
export function applySorting<O>(
  mediatorData: MediatorData<O>,
  sortBy?: Column<O>,
  sortDirection?: SortDirection
): MediatorData<O> {
  const data = [...mediatorData.data];
  if (sortDirection != null && sortBy != null && sortDirection !== '') {
    data.sort((a, b) => {
      const cmp = a[sortBy] < b[sortBy] ? -1 : 1;
      const direction = sortDirection === 'desc' ? -1 : 1;
      return direction * cmp;
    });
  }
  return {
    data,
    total: mediatorData.total
  };
}

/**
 * Determines whether the given object is a valid `MediatorData` instance.
 * It only returns true, if
 * - the object is not null or undefined
 * - is an object
 * - has a `data` field
 * - has a `total` field
 * @param object the object to check against
 * @returns true, if the object is a valid `MediatorData` object
 */
export function instanceOfMediatorData(object: any): object is MediatorData<any> {
  return object != null && typeof object === 'object' && 'data' in object && 'total' in object;
}

export type MediatorDataFilter<O> = (data: MediatorData<O>) => MediatorData<O>;

export function filterMediatorData<O>(
  predicate: (entity: O) => boolean
): MediatorDataFilter<O> {
  return (data: MediatorData<O>) => {
    const filtered = data.data.filter(x => predicate(x));
    return {
      data: filtered,
      total: filtered.length
    };
  };
}
