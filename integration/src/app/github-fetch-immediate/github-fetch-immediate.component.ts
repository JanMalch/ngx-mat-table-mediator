import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SortDirection } from '@angular/material';
import {
  Column,
  Columns,
  MediatedTableComponent,
  MediatorData,
  SimpleTableMediator
} from 'ngx-mat-table-mediator';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { GithubApi, GithubIssue } from '../models';

@Component({
  selector: 'app-github-fetch-immediate',
  templateUrl: './github-fetch-immediate.component.html',
  styleUrls: ['./github-fetch-immediate.component.css']
})
export class GithubFetchImmediateComponent extends MediatedTableComponent<any, GithubIssue>
  implements AfterViewInit {
  columnLabels: { [column in keyof GithubIssue]: string } = {
    created_at: 'Created at',
    state: 'State',
    number: 'Number',
    title: 'Title'
  };

  columns = Object.keys(this.columnLabels) as Columns<GithubIssue>;
  trigger$ = new BehaviorSubject<any>(undefined);

  isRateLimitReached$ = new BehaviorSubject<boolean>(false); // loading starts instantly, use super(SimpleTableMediator, true);

  constructor(private http: HttpClient) {
    super();
  }

  ngAfterViewInit(): void {
    this.initMediatorAsync().then(() => {
      this.mediator.error$.subscribe(() => this.isRateLimitReached$.next(true));
      this.mediator.onFetchBegin$.subscribe(() => this.isRateLimitReached$.next(false));
    });
  }

  fetch(
    payload: undefined,
    sortBy: Column<GithubIssue>,
    sortDirection: SortDirection,
    pageIndex: number,
    pageSize: number
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
