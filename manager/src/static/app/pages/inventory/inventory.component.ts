import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Params } from '@angular/router';
import { BaseControllerComponent } from '../../core/basecontroller.component';
// import { ManagerService } from '../../service/manager.service';
import { MyDeqErrorHandler } from '../../shared/errorHandler';
import { Utils } from '../../shared/Utils';
// import { FacilityTankdtlText } from './facility-tanks-dtl-text';
import * as _ from 'lodash-es';
// import { SECTION_PAGE_TEXT_CONFIG  } from '../../notification/notification-install-dtl-review/section-page-text-config';
import { InventoryListText } from '../../component/inventory-list/inventory-list-page-text';
import { environment } from 'manager/src/static/environments/environment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LoggerService } from '../../shared/lib/logger/logger-service.component';
import { InvetoryService } from '../../service/invetory.service';
import { SortingService } from '../../service/sorting.service';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html'
})
export class InventoryComponent extends BaseControllerComponent implements OnInit {

    errorsList: any[] = [];
    dbSearchForm: FormGroup;
    fullList: any[] = [];
    requestList: any[] = [];
    requestType: string;
    searchKeys: Map<string, string[]> = new Map<string, string[]>();
    placeHolderText: string;
    searchText: string = "";
    dbForm: FormGroup;

    onIntervalList = [];
    searchCache: string = '';
    tableHeaders = [];

    refreshfunctionalities = true;
    constructor(
        public utils: Utils,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        // private service: ManagerService,
        protected errorHandler: MyDeqErrorHandler,
        private logger: LoggerService,
        private inventoryService: InvetoryService,
        private SortingService: SortingService
    ) {
        super(errorHandler, new InventoryListText());

        route.params.subscribe((params) => {
            this.requestType = params["requestType"];
            this.inventoryService.setreqType(this.requestType);
        });
        this.dbForm = this.formBuilder.group({
            searchText: new FormControl(null),
        });

        this.setTableHeaders();
    }

    ngOnInit() {
        this.gettableData();
        if (localStorage.getItem(this.requestType + '-SearchValue')) {
            this.searchCache = localStorage.getItem(this.requestType + '-SearchValue');
        } else {
            this.searchCache = "";
        }

        this.inventoryService.refreshCache.subscribe((data: Data) => {
            if (data.refresh) {
                this.refreshCache();
            }
        })
    }

    setTableHeaders() {
        this.tableHeaders = this.SortingService.getSortHeaderType(
            this.requestType + '-Sort', this.gettableheaders()
        );
    }

    gettableheaders() {
        let headers = this.pageText[this.requestType].table
        return headers;
    }

    async gettableData() {
        this.addSearchKeys(this.requestType);
        this.errorsList = [];
        this.requestList = [];
        this.fullList = [];
        console.log("REQTYPE", this.requestType);

        this.requestList = await this.inventoryService.getInvertoryCache();

        this.tableHeaders.forEach(colData => {
            if (colData.type == "object") {
                this.requestList.forEach(result => {
                    result[colData.sortKey] = "";
                    colData.fieldNames.forEach((field, index) => {
                        if (index == colData.fieldNames.length - 1) {
                            result[colData.sortKey] += result[colData.objectKey] ? result[colData.objectKey][field] : ''
                        } else {
                            result[colData.sortKey] += result[colData.objectKey] ? result[colData.objectKey][field] + ", " : ''

                        }
                    });
                })
            }
        })

        this.fullList = this.requestList;
    }

    async refreshCache() {
        await this.inventoryService.resetInvertoryCache();
        this.searchText = "";
        this.searchCache = "";
        this.setTableHeaders();
        this.gettableData();
        this.refreshfunctionalities = false;
        setTimeout(() => {
            this.refreshfunctionalities = true;
        }, 100);
    }

    addSearchKeys(requestType: string) {
        this.placeHolderText =
            "You can search by any column name, such as Facility ID, Facility Name, etc.";
        this.searchKeys.set("placeId", []);
        this.searchKeys.set("placeName", []);
        this.searchKeys.set("customerName", []);
        this.searchKeys.set("customerId", []);
        this.searchKeys.set("address", ['diplayAddress']);
        this.searchText = "";
        this.searchCache = "";

    }

    updatedSearchList(value: any[]) {
        this.requestList = value;
    }

    viewFacilityDetails(placeId: string) {
        this.utils.navigateTo(['ust', 'facilitydtl', placeId], false);
    }
}
