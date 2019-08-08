import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTable, SortDirection } from '@angular/material';
import {
  Columns,
  MatTableMediator,
  MediatorData,
  TriggerPayload
} from 'ngx-mat-table-mediator';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { mockPersonData, Person } from '../models';

export class MyCustomMediator extends MatTableMediator<void, Person> {
  constructor(
    protected trigger$: TriggerPayload<void>,
    table: MatTable<Person>,
    paginator: MatPaginator,
    sort: MatSort
  ) {
    super(table, paginator, sort);
  }

  fetch(
    payload: undefined,
    sortBy: string,
    sortDirection: SortDirection,
    pageIndex: number,
    pageSize: number
  ): Observable<MediatorData<Person>> {
    return of(mockPersonData(pageSize));
  }
}

@Component({
  selector: 'app-custom',
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.css']
})
export class CustomComponent implements AfterViewInit {
  trigger$ = new BehaviorSubject<void>(undefined);

  mediator: MatTableMediator<void, Person>;

  columns: Columns<Person> = ['name', 'age'];
  columnLabels: { [column in keyof Person]: string } = {
    name: 'Name',
    age: 'Age'
  };

  isLoading$ = of(false);

  @ViewChild(MatTable) table: MatTable<Person>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {}

  ngAfterViewInit() {
    this.mediator = new MyCustomMediator(this.trigger$, this.table, this.paginator, this.sort);

    this.isLoading$ = this.mediator.isLoading$;
    this.mediator.start();
  }
}
