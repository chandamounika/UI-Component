import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { SearchComponent } from './search-component/search-component.component';
import { ReviewComponent } from './review/review.component';
import { HistoryComponent } from './review/history/history.component';
import { DataFilterComponent } from './data-filter/data-filter.component';


@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        RouterModule,
        FormsModule,
        NgbTooltipModule,
        ReactiveFormsModule,
        SharedModule
    ],
    exports: [InventoryListComponent, SearchComponent,
        ReviewComponent,HistoryComponent, DataFilterComponent],

    declarations: [InventoryListComponent, SearchComponent, ReviewComponent,HistoryComponent, DataFilterComponent],

    entryComponents: [HistoryComponent],
    providers: []
})
export class ComponentModule {
}
