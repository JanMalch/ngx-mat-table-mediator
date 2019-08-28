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
export class SelectMediatorConfig extends MediatorConfiguration<void, JsonPlaceholderComment> {
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
  selector: 'app-simple-select',
  template: `
    <p>
      <b>Selected IDs: </b><code>{{ selected }}</code>
    </p>
    <mtm-selectable-table
      (mtmSelect)="onSelect($event)"
      [sortable]="true"
      columns="postId, id, name, email"
      labels="Post, ID, Name, Email"
    >
      <mat-progress-bar mode="indeterminate" mtmLoader="bar"></mat-progress-bar>
      <mat-paginator
        [pageSizeOptions]="[10]"
        [pageSize]="10"
        showFirstLastButtons
      ></mat-paginator>
    </mtm-selectable-table>
  `,
  styleUrls: ['./simple-select.component.css'],
  providers: [{ provide: MediatorConfiguration, useClass: SelectMediatorConfig }]
})
export class SimpleSelectComponent {
  selected = '';

  onSelect(selected: JsonPlaceholderComment[]) {
    this.selected = selected.map(c => c.id).join(', ');
  }
}
