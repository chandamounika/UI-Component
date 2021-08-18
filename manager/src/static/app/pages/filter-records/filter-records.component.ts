import { Component, OnInit } from '@angular/core';
import { BaseControllerComponent } from '../../core/basecontroller.component';
import { MyDeqErrorHandler } from '../../shared/errorHandler';
import { Utils } from '../../shared/Utils';
import * as _ from 'lodash-es';
import { InventoryListText } from '../../component/inventory-list/inventory-list-page-text';
import { FilterConfig } from '../../component/data-filter/data-filter.component';
import { environment } from '../../../../../../manager/src/static/environments/environment';
import { FilterHelper } from '../../shared/FilterHelper';

@Component({
    selector: 'app-testing-filters',
    templateUrl: './filter-records.component.html',
    styleUrls: ['./filter-records.component.scss']
})
export class FilterRecords extends BaseControllerComponent implements OnInit {
    records: any[] = [];
    filterConfig: FilterConfig;
    private filterHelper: FilterHelper = new FilterHelper();
    constructor(
        public utils: Utils,
        protected errorHandler: MyDeqErrorHandler
    ) {
        super(errorHandler, new InventoryListText());
        // this.gettableData();
    }

    ngOnInit() {
        this.records = environment.customers;
        this.setFilterConfig();
    }

    // gettableData() {
    //     this.errorsList = [];
    //     this.apiservice.getFilterResultData().subscribe((response: any) => {
    //         this.records = response;
    //         this.setFilterConfig();

    //     })
    // }

    setFilterConfig() {
        this.filterConfig = {
            name: 'Customer Filters',
            filters: [
                {
                    name: 'Country',
                    type: 'DROPDOWN',
                    filterPath: 'customer.companyAddress.country',
                    options: _.uniq(this.records.map(x => x.customer.companyAddress.country))
                        .map(c => ({ label: c, value: c }))
                },
                {
                    name: 'State',
                    type: 'RADIO',
                    filterPath: 'customer.companyAddress.state',
                    options: _.uniq(this.records.map(x => x.customer.companyAddress.state))
                        .map(s => ({ label: s, value: s }))
                },
                {
                    name: 'prohibitedArea',
                    type: 'DROPDOWN',
                    filterPath: 'userInfo.userAddress.prohibitedArea',
                    isBoolean: true,
                    options: [
                        { label: 'Yes', value: true },
                        { label: 'No', value: false },
                    ]
                },
                {
                    name: 'Phone Area Code',
                    type: 'CHECKBOX',
                    filterPath: 'customer.companyPhone.phoneAreaCode',
                    options: [
                        { label: '602-xxx-xxxx', value: '602' },
                        { label: '801-xxx-xxxx', value: '801' }
                    ]
                }
            ]
        }
        console.log(
            this.filterHelper.filterRecords(this.records, [
                { path: 'customer.companyPhone.phoneAreaCode', values: ['602'] }

            ]
            ));
    }

    onFilterChange(filteredRecords) {
        console.log('FILTERED:', filteredRecords);
    }

}
