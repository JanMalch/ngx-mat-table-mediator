import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
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
import { MinimalComponent } from './minimal/minimal.component';

@NgModule({
  declarations: [AppComponent, MinimalComponent],
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
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
