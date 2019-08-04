import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { MatSnackBar, SortDirection } from '@angular/material';
import {
  MediatedTableComponent,
  MediatorData,
  SimpleTableMediator
} from 'ngx-mat-table-mediator';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { GithubApi, GithubIssue } from '../models';

@Component({
  selector: 'app-github-fetch',
  templateUrl: './github-fetch.component.html',
  styleUrls: ['./github-fetch.component.css']
})
export class GithubFetchComponent extends MediatedTableComponent<any, GithubIssue>
  implements AfterViewInit, OnDestroy {
  columnLabels = {
    created_at: 'Created at',
    state: 'State',
    number: 'Number',
    title: 'Title'
  };

  columns = Object.keys(this.columnLabels);
  trigger$ = new ReplaySubject<any>(1); // loading starts after button click, use super(SimpleTableMediator, false);

  isRateLimitReached$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    super(SimpleTableMediator, false);
  }

  ngAfterViewInit(): void {
    this.initMediatorAsync().then(() => {
      this.mediator.error$.subscribe(() => this.isRateLimitReached$.next(true));
      this.mediator.onFetchBegin$.subscribe(() => {
        this.snackBar.dismiss();
        this.isRateLimitReached$.next(false);
      });
      this.mediator.onResultsFound$.subscribe(count =>
        this.snackBar.open(`Found ${count} results!`)
      );
    });
  }

  fetch(
    payload: undefined,
    sortBy: string,
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

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.snackBar.dismiss();
  }
}