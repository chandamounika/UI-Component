import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { commonRouting } from './common.routes';
import { ComponentModule } from '../component/component.module';
import { SharedModule } from '../shared/shared.module';
import { InventoryComponent } from './inventory/inventory.component';
import { FilterRecords } from './filter-records/filter-records.component';



@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        commonRouting,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        ComponentModule,
        SharedModule
    ],
    declarations: [InventoryComponent, FilterRecords],


    exports: []
})
export class CommonPageModule { }
