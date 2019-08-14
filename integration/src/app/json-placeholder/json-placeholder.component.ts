import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { SortDirection } from '@angular/material';
import {
  Column,
  Columns,
  MediatedTableComponent,
  MediatorData,
  prepareMediatorData
} from 'ngx-mat-table-mediator';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JsonPlaceholderComment } from '../models';

@Component({
  selector: 'app-json-placeholder',
  templateUrl: './json-placeholder.component.html',
  styleUrls: ['./json-placeholder.component.css']
})
export class JsonPlaceholderComponent
  extends MediatedTableComponent<string, JsonPlaceholderComment>
  implements AfterViewInit {
  columns: Columns<JsonPlaceholderComment> = ['postId', 'id', 'name', 'email'];

  trigger$ = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
    super();
  }

  fetch(
    payload: string,
    sortBy: Column<JsonPlaceholderComment>,
    sortDirection: SortDirection,
    pageIndex: number,
    pageSize: number
  ): Observable<MediatorData<JsonPlaceholderComment>> {
    const base$ =
      !!payload && payload.trim().length > 0
        ? this.http.get<Array<JsonPlaceholderComment>>(
            `https://jsonplaceholder.typicode.com/comments?postId=${payload}`
          )
        : this.http.get<Array<JsonPlaceholderComment>>(
            `https://jsonplaceholder.typicode.com/comments`
          );
    return base$.pipe(
      map(rawData => prepareMediatorData(rawData, sortBy, sortDirection, pageIndex, pageSize))
    );
  }
}
