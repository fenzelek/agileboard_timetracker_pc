import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from "@ngx-translate/core";


@Injectable()
export class PaginatorIntlFactory extends MatPaginatorIntl {
  translate: TranslateService;

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    const of = this.translate ? this.translate.instant('tt.pagination.of') : 'of';
    if (length === 0 || pageSize === 0) {
      return '0 ' + of + ' ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' ' + of + ' ' + length;
  };

  injectTranslateService(translate: TranslateService) {
    this.translate = translate;

    this.translate.onLangChange.subscribe(() => {
      this.translateLabels();
    });

    this.translateLabels();
  }

  translateLabels() {
    super.itemsPerPageLabel = this.translate.instant('tt.pagination.per-page');
    super.firstPageLabel = this.translate.instant('tt.pagination.first-page');
    super.lastPageLabel = this.translate.instant('tt.pagination.last-page');
    super.previousPageLabel = this.translate.instant('tt.pagination.previous-page');
    super.nextPageLabel = this.translate.instant('tt.pagination.next-page');
    this.changes.next();
  }

}
