import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CustomComponent } from './custom/custom.component';
import { MinimalComponent } from './minimal/minimal.component';
import { GithubFetchComponent } from './github-fetch/github-fetch.component';
import { GithubFetchImmediateComponent } from './github-fetch-immediate/github-fetch-immediate.component';
import { CustomConfigComponent } from './custom-config/custom-config.component';
import { JsonPlaceholderComponent } from './json-placeholder/json-placeholder.component';
import { JsonPlaceholderTypingComponent } from './json-placeholder-typing/json-placeholder-typing.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomComponent,
    MinimalComponent,
    GithubFetchComponent,
    GithubFetchImmediateComponent,
    CustomConfigComponent,
    JsonPlaceholderComponent,
    JsonPlaceholderTypingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatButtonModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
