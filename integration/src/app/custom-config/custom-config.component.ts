import {
  AfterViewInit,
  Component,
  Injectable,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import {
  MediatedTableComponent,
  MediatorConfig,
  MediatorData,
  SimpleTableMediator,
  MTM_TABLE_TMPL,
  Columns
} from 'ngx-mat-table-mediator';
import { Observable } from 'rxjs';
import { mockPersonData, Person } from '../models';

@Injectable()
export class MyDataService {
  private readonly mocked = mockPersonData(10);

  attemptCount = 0;

  getData(): Observable<MediatorData<Person>> {
    return new Observable(obs$ => {
      this.attemptCount++;
      console.log('MyDataService retrying ...', this.attemptCount);
      if (this.attemptCount % 3 !== 0) {
        obs$.error(new Error('made up error #' + this.attemptCount));
      } else {
        obs$.next(this.mocked);
      }
    });
  }
}

@Component({
  selector: 'app-custom-config',
  template: MTM_TABLE_TMPL,
  styleUrls: ['./custom-config.component.css'],
  providers: [MyDataService],
  encapsulation: ViewEncapsulation.None
})
export class CustomConfigComponent extends MediatedTableComponent<void, Person>
  implements AfterViewInit, OnDestroy {
  columns: Columns<Person> = ['name', 'age'];
  mediatorConfig: Partial<MediatorConfig<Person>> = {
    debounceLoading: 0,
    attempts: 3
  };

  constructor(private myDataService: MyDataService) {
    super(SimpleTableMediator);
  }

  fetch(
    payload?: void,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc' | '',
    pageIndex?: number,
    pageSize?: number
  ): Observable<MediatorData<Person>> {
    return this.myDataService.getData();
  }
}
