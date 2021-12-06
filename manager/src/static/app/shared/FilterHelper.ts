import { SelectedFilter } from "../component/data-filter/data-filter.component";
import { cloneDeep, get } from 'lodash-es';
import { Injectable } from "@angular/core";

export class FilterHelper {

  constructor() { }

  filterRecords(records: any[], filters: SelectedFilter[]) {
    let filteredRecords = cloneDeep(records);

    // console.log('filters', filters)
    filters
      .forEach(({ path, values }) => {
        const valuesToFilter = values.filter(x => x !== null && x !== undefined);
        filteredRecords = valuesToFilter.length 
        ? filteredRecords.filter(r => valuesToFilter.includes(get(r, path))) 
        : filteredRecords;
      });

    return filteredRecords;
  }
}