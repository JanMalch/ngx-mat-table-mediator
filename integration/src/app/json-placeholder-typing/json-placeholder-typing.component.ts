import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTable, SortDirection } from '@angular/material';
import {
  Column,
  Columns,
  MatTableMediator,
  MediatorData,
  prepareMediatorData,
  SimpleTableMediator,
  transformToMediatorData
} from 'ngx-mat-table-mediator';
import { combineLatest, fromEvent, interval, Observable, of } from 'rxjs';
import { debounceTime, map, startWith, tap } from 'rxjs/operators';
import { JsonPlaceholderComment } from '../models';

@Component({
  selector: 'app-json-placeholder-typing',
  templateUrl: './json-placeholder-typing.component.html',
  styleUrls: ['./json-placeholder-typing.component.css']
})
export class JsonPlaceholderTypingComponent implements AfterViewInit {
  trigger$: Observable<string>;

  mediator: MatTableMediator<string, JsonPlaceholderComment>;

  columns: Columns<JsonPlaceholderComment> = ['postId', 'id', 'name', 'email'];

  isLoading$ = of(false);

  timestamp: Date;

  @ViewChild('query') queryInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatTable) table: MatTable<JsonPlaceholderComment>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    const query$ = fromEvent(this.queryInput.nativeElement, 'keyup').pipe(
      debounceTime(250),
      map(() => this.queryInput.nativeElement.value),
      startWith('')
    );

    const interval$ = interval(10_000).pipe(startWith(0));
    this.trigger$ = combineLatest(query$, interval$).pipe(
      tap(() => (this.timestamp = new Date())),
      map(([query]) => query)
    );

    const fetchFn = (
      payload: string,
      sortBy: Column<JsonPlaceholderComment>,
      sortDirection: SortDirection,
      pageIndex: number,
      pageSize: number
    ): Observable<MediatorData<JsonPlaceholderComment>> => {
      const base$ =
        !!payload && payload.length > 0
          ? this.http.get<Array<JsonPlaceholderComment>>(
              `https://jsonplaceholder.typicode.com/comments?postId=${payload}`
            )
          : this.http.get<Array<JsonPlaceholderComment>>(
              `https://jsonplaceholder.typicode.com/comments`
            );

      return base$.pipe(
        map(rawData =>
          prepareMediatorData(rawData, sortBy, sortDirection, pageIndex, pageSize)
        )
      );
    };

    this.mediator = new SimpleTableMediator<string, JsonPlaceholderComment>(
      fetchFn,
      this.trigger$,
      this.table,
      this.paginator,
      this.sort
    );

    this.isLoading$ = this.mediator.isLoading$;
    Promise.resolve().then(() => this.mediator.start());
  }
}
