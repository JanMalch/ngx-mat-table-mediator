import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MtmTableSortPaginatorModule } from 'ngx-mat-table-mediator';

import { AppComponent } from './app.component';
import { CustomColumnComponent } from './custom-column/custom-column.component';
import { GithubFetchImmediateComponent } from './github-fetch-immediate/github-fetch-immediate.component';
import { MinimalComponent } from './minimal/minimal.component';
import { SimpleSelectComponent } from './simple-select/simple-select.component';
import { WithQueryComponent } from './with-query/with-query.component';

@NgModule({
  declarations: [
    AppComponent,
    MinimalComponent,
    WithQueryComponent,
    GithubFetchImmediateComponent,
    SimpleSelectComponent,
    CustomColumnComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MtmTableSortPaginatorModule,
    MatTabsModule,
    MatButtonModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
