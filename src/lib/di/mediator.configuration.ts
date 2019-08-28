import { TrackByFunction } from '@angular/core';
import { SortDirection } from '@angular/material';
import { Column, MediatorData, TriggerPayload } from '../models';
import { Observable, of } from 'rxjs';

export abstract class MediatorConfiguration<F, O> {
  public trackByFn: TrackByFunction<O> = undefined;
  public attempts = 0;
  public debounceLoading = 150;
  public readonly payload$: TriggerPayload<F> = of(undefined);

  public trigger(payload: F) {
    throw new Error(
      'Default payload$ cannnot be triggered. Override payload$ and trigger function in MediatorConfiguration'
    );
  }

  /**
   * The function which is used for communicating with the API.
   * @param payload the latest trigger payload
   * @param sortBy the currently selected column
   * @param sortDirection `"asc"`, `"desc"` or `""`
   * @param pageIndex the current page the user is on
   * @param pageSize the given page size by the user
   */
  public abstract fetch(
    payload?: F,
    sortBy?: Column<O>,
    sortDirection?: SortDirection,
    pageIndex?: number,
    pageSize?: number
  ): Observable<MediatorData<O>>;
}
