/**
 * Template-string for an Angular component, with only a table.
 * The table will always have an `mtm-table` class.
 * @example
 * ```typescript
 * import { MTM_TABLE_TMPL } from 'ngx-mat-table-mediator';
 *
 * @Component({
 *   selector: 'app-my-table',
 *   template: MTM_TABLE_TMPL,
 *   styleUrls: ['./my-table.component.css']
 * })
 * ```
 */
export const MTM_TABLE_TMPL = `<table mat-table class="mtm-table">
      <ng-container *ngFor="let col of columns"
        [matColumnDef]="col">
        <th mat-header-cell *matHeaderCellDef>{{ col }}</th>
        <td mat-cell *matCellDef="let row">{{row[col]}}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let row; columns: columns;"></tr>
    </table>`;

/**
 * Template-string for an Angular component, with a table and a paginator.
 * The paginator is configured with `[pageSizeOptions]="[10, 25, 50, 100]"` and `[pageSize]="25"`.
 * The elements are wrapped in a `div` container, with a `mtt-container` class.
 * The table will always have an `mtm-table` class.
 * @example
 * ```typescript
 * import { MTM_TABLE_PAGINATOR_TMPL } from 'ngx-mat-table-mediator';
 *
 * @Component({
 *   selector: 'app-my-table',
 *   template: MTM_TABLE_PAGINATOR_TMPL,
 *   styleUrls: ['./my-table.component.css']
 * })
 * ```
 */
export const MTM_TABLE_PAGINATOR_TMPL = `<div class="mtm-container">
    <table mat-table class="mtm-table">
      <ng-container *ngFor="let col of columns"
        [matColumnDef]="col">
        <th mat-header-cell *matHeaderCellDef>{{ col }}</th>
        <td mat-cell *matCellDef="let row">{{row[col]}}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let row; columns: columns;"></tr>
    </table>
  <mat-paginator [pageSizeOptions]="[10, 25, 50, 100]" [pageSize]="25" showFirstLastButtons></mat-paginator>
  </div>`;

/**
 * Template-string for an Angular component, with a table, a paginator and sort headers.
 * The paginator is configured with `[pageSizeOptions]="[10, 25, 50, 100]"` and `[pageSize]="25"`.
 * The elements are wrapped in a `div` container, with a `mtt-container` class.
 * The table will always have an `mtm-table` class.
 * @example
 * ```typescript
 * import { MTM_TABLE_SORT_PAGINATOR_TMPL } from 'ngx-mat-table-mediator';
 *
 * @Component({
 *   selector: 'app-my-table',
 *   template: MTM_TABLE_SORT_PAGINATOR_TMPL,
 *   styleUrls: ['./my-table.component.css']
 * })
 * ```
 */
export const MTM_TABLE_SORT_PAGINATOR_TMPL = `<div class="mtm-container">
    <table mat-table class="mtm-table"
           matSort [matSortActive]="columns[0]" matSortDisableClear matSortDirection="asc">
      <ng-container *ngFor="let col of columns"
        [matColumnDef]="col">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ col }}</th>
        <td mat-cell *matCellDef="let row">{{row[col]}}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let row; columns: columns;"></tr>
    </table>
  <mat-paginator [pageSizeOptions]="[10, 25, 50, 100]" [pageSize]="25" showFirstLastButtons></mat-paginator>
  </div>`;
