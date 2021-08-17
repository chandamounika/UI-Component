import { Component, OnInit } from '@angular/core';
import { BaseControllerComponent } from '../../core/basecontroller.component';
import { MyDeqErrorHandler } from '../../shared/errorHandler';
import { Utils } from '../../shared/Utils';
import * as _ from 'lodash-es';
import { InventoryListText } from '../../component/inventory-list/inventory-list-page-text';
import { ApiService } from '../../service/api.service';
import { FilterConfig } from '../../component/data-filter/data-filter.component';
import { Helper } from '../../shared/helper';

@Component({
    selector: 'app-testing-filters',
    templateUrl: './filter-records.component.html',
    styleUrls: ['./filter-records.component.scss']
})
export class FilterRecords extends BaseControllerComponent implements OnInit {
    records: any[] = [];
    filterConfig: FilterConfig;
    constructor(
        public utils: Utils,
        protected errorHandler: MyDeqErrorHandler,
        private apiservice: ApiService,
        private helper : Helper
    ) {
        super(errorHandler, new InventoryListText());
        this.gettableData();
    }

    ngOnInit() {

    }
  
    gettableData() {
        this.errorsList = [];
        this.apiservice.getFilterResultData().subscribe((response: any) => {
            this.records =response;
            this.setFilterConfig();
        })
    }

    setFilterConfig() {
        this.filterConfig = {
            name: 'Customer Filters',
            filters: [
                {
                    name: 'Country',
                    type: 'DROPDOWN',
                    options: 
                    _.uniq(this.records.map(x => x.customer.companyAddress.country))
                    .map(c =>({label: c, value: c, filterFn: x => x.customer.companyAddress.country === c }))
                },
                {
                    name: 'State',
                    type: 'RADIO',
                    options:
                    _.uniq(this.records.map(x => x.customer.companyAddress.state))
                    .map(s =>({label: s, value: s, filterFn: x => x.customer.companyAddress.state === s }))
                },
                {
                    name: 'prohibitedArea',
                    type: 'DROPDOWN',
                    options: [
                        {label: 'true', value:'true', filterFn: x => x.userInfo?.userAddress?.prohibitedArea === true },
                        {label: 'false', value:'false', filterFn: x => x.userInfo?.userAddress?.prohibitedArea === false },
                    ]
                },
                {
                    name: 'Phone Area Code',
                    type: 'CHECKBOX',
                    options: [
                        {label: '602-xxx-xxxx', value: '602', filterFn: x => x.customer.companyPhone.phoneAreaCode === '602' },
                        {label: '801-xxx-xxxx', value: '801', filterFn: x => x.customer.companyPhone.phoneAreaCode === '801' }
                    ]
                }
            ]
        }
        // console.log(this.helper.filterRecords(this.records, [(x) => x.customer.companyAddress.country === 'US',  x => x.customer.companyPhone.phoneAreaCode === '602']), "hello")
    }

    onFilterChange(filteredRecords) {
        console.log('FILTERED:', filteredRecords);
    }

}
