import { Filter } from "../component/data-filter/data-filter.component";
import { cloneDeep } from 'lodash-es';
import { Injectable } from "@angular/core";

@Injectable()
export class Helper {

    constructor(){}
    
    filterRecords(records: any, filterFn:any[]) {
        let filteredRecords = cloneDeep(records);
        filterFn
          .forEach(filterFns => {
            filteredRecords = this.filterRecordsForEachFilter(filteredRecords, filterFns);
          });
       return filteredRecords;
      }
    
    filterRecordsForEachFilter(records: any[], filterFns: Function[]) {
        const filters = filterFns.filter(Boolean);
        return filters.length
          ? records.filter(r => filters.some(f => f(r)))
          : records;
      }
}