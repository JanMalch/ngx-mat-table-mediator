import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatCheckboxModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { LoadingMarkerDirective } from '../components/loading-marker.directive';
import { MtmTableSelectableComponent } from '../components/mtm-table-selectable.component';
import { MtmTableComponent } from '../components/mtm-table.component';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule
  ],
  exports: [MtmTableComponent, MtmTableSelectableComponent, LoadingMarkerDirective],
  declarations: [MtmTableComponent, MtmTableSelectableComponent, LoadingMarkerDirective],
  providers: []
})
export class MtmTableSortPaginatorModule {}
