import {
  AfterViewInit,
  ContentChild,
  ContentChildren,
  QueryList,
  ViewChild
} from '@angular/core';
import { MatColumnDef, MatPaginator, MatSort, MatTable } from '@angular/material';
import { MediatorProxy } from '../di/mediator-proxy.service';

export abstract class MediatedTableComponent<F, O> implements AfterViewInit {
  /**
   * Queried `@ViewChild` table element
   */
  @ViewChild(MatTable) table: MatTable<O>;
  /**
   * Queried `@ViewChild` paginator, may be `undefined`
   * if no paginator is in the template
   */
  @ContentChild(MatPaginator) paginator?: MatPaginator;
  /**
   * Queried `@ViewChild` sort directive, may be `undefined`
   * if no sort is in the template
   */
  @ViewChild(MatSort) sort?: MatSort;

  @ContentChildren(MatColumnDef) actionDefs: QueryList<MatColumnDef>;

  abstract proxy: MediatorProxy<F, O>;

  addColumn(def: MatColumnDef) {
    throw new Error('This component does not support projecting additional columns');
  }

  ngAfterViewInit(): void {
    this.actionDefs.forEach(def => {
      this.addColumn(def);
      this.table.addColumnDef(def);
    });

    this.proxy.connect({
      table: this.table,
      paginator: this.paginator,
      sort: this.sort
    });
  }
}
