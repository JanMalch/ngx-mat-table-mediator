import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { SortDirection } from '@angular/material';
import {
  Column,
  Columns,
  MediatedTableComponent,
  MediatorConfiguration,
  MediatorData,
  MediatorProxy
} from 'ngx-mat-table-mediator';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GithubApi, GithubIssue } from '../models';

@Injectable()
export class GithubFetchMediatorConfig extends MediatorConfiguration<void, GithubIssue> {
  readonly payload$ = new BehaviorSubject<void>(undefined);
  debounceLoading = 0;

  constructor(private http: HttpClient) {
    super();
  }

  trigger() {
    this.payload$.next(undefined);
  }

  fetch(
    payload?: void,
    sortBy?: Column<GithubIssue>,
    sortDirection?: SortDirection,
    pageIndex?: number,
    pageSize?: number
  ): Observable<MediatorData<GithubIssue>> {
    const href = 'https://api.github.com/search/issues';
    const requestUrl = `${href}?q=repo:angular/components&sort=${sortBy}&order=${sortDirection}&page=${pageIndex +
      1}`;

    return this.http.get<GithubApi>(requestUrl).pipe(
      map(response => ({
        data: response.items,
        total: response.total_count
      }))
    );
  }
}

@Component({
  selector: 'app-github-fetch-immediate',
  templateUrl: './github-fetch-immediate.component.html',
  styleUrls: ['./github-fetch-immediate.component.css'],
  providers: [
    { provide: MediatorConfiguration, useClass: GithubFetchMediatorConfig },
    MediatorProxy
  ]
})
export class GithubFetchImmediateComponent extends MediatedTableComponent<void, GithubIssue> {
  isRateLimitReached$ = new BehaviorSubject<boolean>(false);

  columnLabels: { [column in keyof GithubIssue]: string } = {
    created_at: 'Created at',
    state: 'State',
    number: 'Number',
    title: 'Title'
  };
  columns = Object.keys(this.columnLabels) as Columns<GithubIssue>;

  constructor(
    public config: MediatorConfiguration<void, GithubIssue>,
    public proxy: MediatorProxy<void, GithubIssue>
  ) {
    super();
  }
}
