import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';
import { Observable, of } from 'rxjs';
import {
  MediatedTableComponent,
  MediatorData,
  MTM_TABLE_SORT_PAGINATOR_TMPL,
  SimpleTableMediator
} from '../public-api';

@Component({
  selector: 'lib-test',
  template: MTM_TABLE_SORT_PAGINATOR_TMPL,
  styles: []
})
export class TestComponent extends MediatedTableComponent<void, { name: string }> {
  columns = ['name'];

  constructor() {
    super(SimpleTableMediator);
  }

  fetch(
    payload?: void,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc' | '',
    pageIndex?: number,
    pageSize?: number
  ): Observable<MediatorData<{ name: string }>> {
    return of({
      total: 10,
      data: [{ name: 'A' }]
    });
  }
}

describe('MediatedTableComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [MatTableModule, MatPaginatorModule, MatSortModule]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });
});
