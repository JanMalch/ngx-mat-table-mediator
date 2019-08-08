# ngx-mat-table-mediator <a href="https://material.angular.io/components/table/overview"><img src="https://angular.io/generated/images/marketing/concept-icons/material.svg" width="90" height="90" align="right"></a>

[![Docs](https://img.shields.io/badge/docs-available-blue)][docs-url]
[![npm](https://badge.fury.io/js/ngx-mat-table-mediator.svg)][npm-url]
[![Travis-CI](https://travis-ci.org/JanMalch/ngx-mat-table-mediator.svg?branch=master)][build-url]
[![codecov](https://codecov.io/gh/JanMalch/ngx-mat-table-mediator/branch/master/graph/badge.svg)][codecov-url]

<i>Simplify Angular Material's <code>mat-table</code>.</i>  


## Installation & Usage  
  
```bash  
npm i ngx-mat-table-mediator  
```   
At the core of this library is the `abstract class MatTableMediator<F, O>`. All functionality builds on top of it.  
The library also provides an `abstract class MediatedTableComponent<F, O>`.  
  
>The generic type `<F>` always describes the type of the fetch input-payload, for example a form output . The generic type `<O>` always describes the type of the fetch output  
  
You can read the detailed docs [here](https://janmalch.github.io/ngx-mat-table-mediator/index.html).  Extensive examples are provided in the [integration](https://github.com/JanMalch/ngx-mat-table-mediator/tree/master/integration/src/app) directory and can be seen in action in the [demo](https://janmalch.github.io/ngx-mat-table-mediator-demo). **A minimal component with a table, pagniator and sorting is shown [below](#define-behaviour-1).**
  
  
## `abstract class MatTableMediator<F, O>`  
  
The class consists of a chain of methods, that you may hook into.  
It also provides several observables to react to certain events.  
  
### Define behaviour  
  
The `fetch` method is the only abstract method, that you have to implement.  
  
- [`fetch`](https://janmalch.github.io/ngx-mat-table-mediator/classes/_mat_table_mediator_.mattablemediator.html#fetch) → defines how the data is fetched  
- [`start`](https://janmalch.github.io/ngx-mat-table-mediator/classes/_mat_table_mediator_.mattablemediator.html#start) → setups and subscribes to the data & page-reset observable  
- [`createDataFetch`](https://janmalch.github.io/ngx-mat-table-mediator/classes/_mat_table_mediator_.mattablemediator.html#createdatafetch) → creates the observable that fetches the table data  
- [`handleResult`](https://janmalch.github.io/ngx-mat-table-mediator/classes/_mat_table_mediator_.mattablemediator.html#handleresult) → handles the result of the data fetch observable  
- [`handleError`](https://janmalch.github.io/ngx-mat-table-mediator/classes/_mat_table_mediator_.mattablemediator.html#handlerrror) → handles any errors occurring in the data fetch observable  
- [`createOnPageReset`](https://janmalch.github.io/ngx-mat-table-mediator/classes/_mat_table_mediator_.mattablemediator.html#createonpagereset) → creates the observable that indicates a page reset  
- [`handlePageReset`](https://janmalch.github.io/ngx-mat-table-mediator/classes/_mat_table_mediator_.mattablemediator.html#handlepagereset) → handles the page-reset observable  
  
### Events  
  
- [`data$: Observable<Array<O>>`](https://janmalch.github.io/ngx-mat-table-mediator/classes/_mat_table_mediator_.mattablemediator.html#data_) → the data for the table. **You do not have to connect the table with this observable!**  
- [`error$: Observable<Error>`](https://janmalch.github.io/ngx-mat-table-mediator/classes/_mat_table_mediator_.mattablemediator.html#error_) → any errors occurring while fetching. Note that the mediator will still work  
- [`isLoading$: Observable<boolean>`](https://janmalch.github.io/ngx-mat-table-mediator/classes/_mat_table_mediator_.mattablemediator.html#isloading_) → indicates loading  
- [`totalResults$: Observable<number>`](https://janmalch.github.io/ngx-mat-table-mediator/classes/_mat_table_mediator_.mattablemediator.html#totalresults_) → total count of results that are available on the server  
- [`onPageReset$: Observable<[EventEmitter<Sort>, F] | any>`](https://janmalch.github.io/ngx-mat-table-mediator/classes/_mat_table_mediator_.mattablemediator.html#onpagereset_) → emits when ever the page should be reset   
- [`onResultsFound$: Observable<number>`](https://janmalch.github.io/ngx-mat-table-mediator/classes/_mat_table_mediator_.mattablemediator.html#onresultsfound_) → only emits if results were found (x > 0)  
- [`onNoResultsFound$: Observable<void>`](https://janmalch.github.io/ngx-mat-table-mediator/classes/_mat_table_mediator_.mattablemediator.html#onnoresultsfound_) → only emits if no results were found (x <= 0)  
- [`onFetchBegin$: Observable<void>`](https://janmalch.github.io/ngx-mat-table-mediator/classes/_mat_table_mediator_.mattablemediator.html#onfetchbegin_) → only emits if loading has started. You might use this to hide previous errors  
  
### Example & Usage  
  
The library has two basic implementations:  
- [`SimpleTableMediator`](https://janmalch.github.io/ngx-mat-table-mediator/classes/_mediators_simple_mediator_.simpletablemediator.html): takes the `fetch` function as a `constructor` argument  
- [`ArrayTableMediator`](https://janmalch.github.io/ngx-mat-table-mediator/classes/_mediators_array_mediator_.arraytablemediator.html): takes the `fetch` function as a `constructor` argument and calls [`prepareMediatorData`](https://janmalch.github.io/ngx-mat-table-mediator/modules/_mediators_array_mediator_.html#preparemediatordata) on it  
  
You can see the classes used here:  
  
- [Custom Mediator](https://github.com/JanMalch/ngx-mat-table-mediator/blob/master/integration/src/app/custom/custom.component.ts)  
- [ArrayTableMediator with query](https://github.com/JanMalch/ngx-mat-table-mediator/blob/master/integration/src/app/json-placeholder-typing/json-placeholder-typing.component.ts)  
  
## `abstract class MediatedTableComponent<F, O>`  
  
The components still require some boilerplate code like querying the elements with `@ViewChild`.  
  
The `MediatedTableComponent` reduces the code even further, to just a few lines.  
The absolute minimum consists of  
- defining the columns: `columns = ['name', 'age'];`  
- defining the used mediator class: `constructor() { super(SimpleTableMediator); }`  
- implementing the `fetch` function: `return this.http.get('my-endpoint');`  
  
The library also provides some [templates](https://janmalch.github.io/ngx-mat-table-mediator/modules/_templates_.html) for your components.  
  
The [`MediatedTableComponent`](https://janmalch.github.io/ngx-mat-table-mediator/classes/_mediated_table_component_.mediatedtablecomponent.html) exposes the `mediator` instance, so you can also react to the events mentioned above.
Additionally you have access to
- `isLoading$` observable, that connects to the mediator, when available
- `mediatorConfig` to configure the mediator
- `trigger$` to overwrite the trigger for fetching, defaults to `of(undefined)`
  
### Define behaviour  
  
```typescript  
@Component({
  selector: 'app-minimal',
  template: MTM_TABLE_SORT_PAGINATOR_TMPL, // template with table, sort and paginator
  styleUrls: ['./minimal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MinimalComponent extends MediatedTableComponent<void, Person>
  implements AfterViewInit, OnDestroy {
  columns: Columns<Person> = ['name', 'age'];

  constructor(private http: HttpClient) {
    super(SimpleTableMediator);
  }

  fetch(
    payload?: void,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc' | '',
    pageIndex?: number,
    pageSize?: number
  ): Observable<MediatorData<Person>> {
    return this.http.get<MediatorData<Person>>(`/persons?page=${pageIndex}&size=${pageSize}`);
  }
}
```  
  
### Example & Usage  
  
- [Minimal Example](https://github.com/JanMalch/ngx-mat-table-mediator/blob/master/integration/src/app/minimal/minimal.component.ts)  
- [Fetching via HTTP](https://github.com/JanMalch/ngx-mat-table-mediator/blob/master/integration/src/app/github-fetch/github-fetch.component.ts)


[docs-url]: https://janmalch.github.io/ngx-mat-table-mediator/index.html
[npm-url]: https://www.npmjs.com/package/ngx-mat-table-mediator
[build-url]: https://travis-ci.org/JanMalch/ngx-mat-table-mediator
[codecov-url]:https://codecov.io/gh/JanMalch/ngx-mat-table-mediator
