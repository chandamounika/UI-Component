import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Helper } from '../../shared/helper';

export interface FilterConfig {
  name: string;
  filters: Filter[];
}

export interface Filter {
  name: string;
  type: 'DROPDOWN' | 'CHECKBOX' | 'RADIO';
  options: FilterOption[];
}

export class FilterOption {
  label: string;
  value: any;
  filterFn: Function;
}

@Component({
  selector: 'app-data-filter',
  templateUrl: './data-filter.component.html',
  styleUrls: ['./data-filter.component.scss']
})
export class DataFilterComponent implements OnInit {

  @Input() filterConfig: FilterConfig;
  @Input() records: any[];

  @Output() filterChange = new EventEmitter<any[]>();
  selectedFiltersMap: { [key: string]: Function[] } = {};
  constructor(private helper : Helper) { }

  ngOnInit(): void {
  }

  onDropDownChange(event, filter: Filter) {
    const filterFn = filter.options.find(x => x.value === event?.target?.value)?.filterFn;
    this.selectedFiltersMap[filter.name] = [filterFn];
    const getFilterFn = Object.values(this.selectedFiltersMap)
    console.log(getFilterFn[0])
    const filteredRecords = this.helper.filterRecords(this.records,  getFilterFn)
    this.filterChange.emit(filteredRecords);
  }

  onRadioChange(event, filter: Filter) {
    const filterFn = filter.options.find(x => x.value === event?.target?.value)?.filterFn;
    this.selectedFiltersMap[filter.name] = [filterFn];
    const getFilterFn = Object.values(this.selectedFiltersMap)
    const filteredRecords = this.helper.filterRecords(this.records,  getFilterFn)
    this.filterChange.emit(filteredRecords);
  }

  onCheckBoxChange(event, filter: Filter) {
    const filterFn = filter.options.find(x => x.value === event?.target?.value)?.filterFn;
    if (event.target.checked) {
      if (this.selectedFiltersMap[filter.name]) {
        this.selectedFiltersMap[filter.name].push(filterFn);
      }
      else {
        this.selectedFiltersMap[filter.name] = [filterFn];
      }
    }
    else {
      this.selectedFiltersMap[filter.name] = this.selectedFiltersMap[filter.name].filter(x => x !== filterFn);
    }
    const getFilterFn = Object.values(this.selectedFiltersMap)
    const filteredRecords = this.helper.filterRecords(this.records,  getFilterFn)
    this.filterChange.emit(filteredRecords);
  }
}
