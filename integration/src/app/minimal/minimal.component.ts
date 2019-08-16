import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Injectable, ViewChild } from '@angular/core';
import { SortDirection } from '@angular/material';
import {
  Column,
  MediatorConfiguration,
  MediatorData,
  prepareMediatorData
} from 'ngx-mat-table-mediator';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { JsonPlaceholderComment } from '../models';

@Injectable()
export class MinimalMediatorConfig extends MediatorConfiguration<
  string,
  JsonPlaceholderComment
> {
  readonly payload$ = new BehaviorSubject<string>(undefined);

  constructor(private http: HttpClient) {
    super();
  }

  trigger(payload: string) {
    this.payload$.next(payload);
  }

  fetch(
    payload?: string,
    sortBy?: Column<JsonPlaceholderComment>,
    sortDirection?: SortDirection,
    pageIndex?: number,
    pageSize?: number
  ): Observable<MediatorData<JsonPlaceholderComment>> {
    const base$ =
      !!payload && payload.length > 0
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

@Component({
  selector: 'app-minimal',
  template: `
    <input #myquery />
    <mtm-mediated-table
      [selectable]="true"
      (mtmSelect)="onSelect($event)"
      [sortable]="true"
      columns="postId, id, name, email"
      labels="Post, ID, Name, Email"
    >
      <mat-progress-bar mode="indeterminate" mtmLoader="bar"></mat-progress-bar>
      <!--<mat-spinner mode="indeterminate" mtmLoader="backdrop"></mat-spinner>-->
      <mat-paginator
        [pageSizeOptions]="[10, 25, 50, 100]"
        [pageSize]="25"
        showFirstLastButtons
      ></mat-paginator>
    </mtm-mediated-table>
  `,
  styleUrls: ['./minimal.component.css'],
  providers: [{ provide: MediatorConfiguration, useClass: MinimalMediatorConfig }]
})
export class MinimalComponent implements AfterViewInit {
  @ViewChild('myquery', { read: ElementRef }) inputEl: ElementRef<HTMLInputElement>;

  constructor(private config: MediatorConfiguration<string, JsonPlaceholderComment>) {}

  ngAfterViewInit(): void {
    fromEvent(this.inputEl.nativeElement, 'keyup')
      .pipe(
        debounceTime(250),
        map(() => this.inputEl.nativeElement.value)
      )
      .subscribe(value => this.config.trigger(value));
  }

  onSelect(selected: JsonPlaceholderComment[]) {
    console.log('selected:', selected);
  }
}
