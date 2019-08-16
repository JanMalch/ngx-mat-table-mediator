import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatCheckboxModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { LoadingMarkerDirective } from '../components/loading-marker.directive';
import { MtmTableSortPaginatorComponent } from '../components/mtm-table-sort-paginator.component';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule
  ],
  exports: [MtmTableSortPaginatorComponent, LoadingMarkerDirective],
  declarations: [MtmTableSortPaginatorComponent, LoadingMarkerDirective],
  providers: []
})
export class MtmTableSortPaginatorModule {}
