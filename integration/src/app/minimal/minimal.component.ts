import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { SortDirection } from '@angular/material';
import {
  Column,
  MediatorConfiguration,
  MediatorData,
  prepareMediatorData
} from 'ngx-mat-table-mediator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JsonPlaceholderComment } from '../models';

@Injectable()
export class MinimalMediatorConfig extends MediatorConfiguration<
  void,
  JsonPlaceholderComment
> {
  constructor(private http: HttpClient) {
    super();
  }

  fetch(
    payload?: void,
    sortBy?: Column<JsonPlaceholderComment>,
    sortDirection?: SortDirection,
    pageIndex?: number,
    pageSize?: number
  ): Observable<MediatorData<JsonPlaceholderComment>> {
    return this.http
      .get<Array<JsonPlaceholderComment>>(`https://jsonplaceholder.typicode.com/comments`)
      .pipe(
        map(rawData =>
          prepareMediatorData(rawData, sortBy, sortDirection, pageIndex, pageSize)
        )
      );
  }
}

@Component({
  selector: 'app-minimal',
  template: `
    <mtm-table
      [sortable]="true"
      columns="postId, id, name, email"
      labels="Post, ID, Name, Email"
      [allColumns]="['postId', 'id', 'name', 'email']"
    >
      <mat-spinner mode="indeterminate" mtmLoader="backdrop"></mat-spinner>
      <mat-paginator
        [pageSizeOptions]="[10, 25, 50, 100]"
        [pageSize]="25"
        showFirstLastButtons
      ></mat-paginator>
    </mtm-table>
  `,
  styleUrls: ['./minimal.component.css'],
  providers: [{ provide: MediatorConfiguration, useClass: MinimalMediatorConfig }]
})
export class MinimalComponent {}
