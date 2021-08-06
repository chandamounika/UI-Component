import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

@Component({
    selector: 'search-component',
    templateUrl: 'search-component.component.html',
})

export class SearchComponent implements OnInit {


    @Input() placeholderText: string;
    @Input() searchList: any[];
    @Input() searchKey: Map<string, string[]>;
    @Input() tabName: string;
    @Output() updatedSearchList = new EventEmitter();
    @Input() searchCache: string;

    dbSearchForm: FormGroup;
    searchText: string;
    regularExp: RegExp;
    tempReturnList: any[];
    requestType: any;
    constructor(private formBuilder: FormBuilder,
        private route:ActivatedRoute) {
        this.dbSearchForm = this.formBuilder.group({
            searchByKey: ['-1'],
            searchByValue: [''],
        });
        this.route.params.subscribe((params) => {
            this.requestType = params["requestType"];

            console.log(" this.requestType",  this.requestType)
        });
    };

    ngOnInit() { 
        
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.placeholderText) {
            this.dbSearchForm.controls['searchByValue'].setValue('');
        }

        if (this.searchCache) {
            this.dbSearchForm.get('searchByValue').setValue(this.searchCache);
            this.searchRequest(this.dbSearchForm.value);
        }
    }

    enterSerchText() {
        localStorage.setItem(this.requestType+'-SearchValue', this.dbSearchForm.get('searchByValue').value)
    }

    searchRequest = (searchForm) => {
        this.searchText = searchForm.searchByValue;
        if (!this.searchText || this.searchText === '') { 
            this.updatedSearchList.emit(this.searchList);
        }
        else {
            this.tempReturnList = this.searchList;
            let finalList: any[] = [];
            this.searchKey.forEach((value: string[], key: string) => {
                this.tempReturnList = this.returnList(this.searchList, key.toString());
                _.forEach(this.tempReturnList, function (value) {
                    finalList.push(value);
                });
            });
            finalList = _.uniqWith(finalList, _.isEqual);
            this.updatedSearchList.emit(finalList);
        }
    }

    returnList(searchList, searchKey) {
        const regularExp = new RegExp('(' + this.searchText.trim() + ')', 'i');
        let tempList = searchList;
        tempList = _.filter(tempList, function (o) {
            //console.log(o[searchKey]);
            if (o[searchKey] && o[searchKey].length === 0)
                return (o[searchKey] && o[searchKey].toString().match(regularExp));
            else
                return (o[searchKey] && JSON.stringify(o[searchKey]).toString().match(regularExp));
        });
        return tempList;
    }

}
