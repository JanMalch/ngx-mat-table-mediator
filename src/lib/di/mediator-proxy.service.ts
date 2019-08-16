import { Injectable, TrackByFunction } from '@angular/core';
import { MatPaginator, MatSort, MatTable } from '@angular/material';
import { MatTableMediator } from 'ngx-mat-table-mediator';
import { MediatorConfiguration } from './mediator.configuration';

export interface MatDirectives<F, O> {
  table: MatTable<O>;
  paginator?: MatPaginator;
  sort?: MatSort;
}

export interface MtmAfterViewInit<F, O> {
  mtmAfterViewInit(config: MatDirectives<F, O>);
}

@Injectable()
export class MediatorProxy<F, O> implements MtmAfterViewInit<F, O> {
  public mediator: MatTableMediator<F, O>;
  public table: MatTable<O>;
  public paginator?: MatPaginator;
  public sort?: MatSort;

  constructor(protected configuration: MediatorConfiguration<F, O>) {}

  mtmAfterViewInit(config: MatDirectives<F, O>) {
    this.table = config.table;
    this.paginator = config.paginator;
    this.sort = config.sort;
    this.mediator = new MatTableMediator<F, O>(
      this.configuration,
      this.table,
      this.paginator,
      this.sort
    );
    this.mediator.start();
  }
}
