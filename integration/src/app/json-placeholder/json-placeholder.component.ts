import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { SortDirection } from '@angular/material';
import { ArrayTableMediator, Columns, MediatedTableComponent } from 'ngx-mat-table-mediator';
import { BehaviorSubject, Observable } from 'rxjs';
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
    super(ArrayTableMediator, true);
  }

  fetch(
    payload: string,
    sortBy: string,
    sortDirection: SortDirection,
    pageIndex: number,
    pageSize: number
  ): Observable<Array<Comment>> {
    return !!payload && payload.trim().length > 0
      ? this.http.get<Array<Comment>>(
          `https://jsonplaceholder.typicode.com/comments?postId=${payload}`
        )
      : this.http.get<Array<Comment>>(`https://jsonplaceholder.typicode.com/comments`);
  }
}
