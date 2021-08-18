import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FilterHelper } from '../../shared/FilterHelper';

export interface FilterConfig {
  name: string;
  filters: Filter[];
}

export interface Filter {
  name: string;
  type: 'DROPDOWN' | 'CHECKBOX' | 'RADIO';
  filterPath: string;
  isBoolean?: boolean;
  options: FilterOption[];
}

export class FilterOption {
  label: string;
  value: any;
  // filterFn: Function;
}

export interface SelectedFilter { 
  path: string, 
  values: any[] 
}
export type SelectedFilters = { [key: string]: SelectedFilter };

@Component({
  selector: 'app-data-filter',
  templateUrl: './data-filter.component.html',
  styleUrls: ['./data-filter.component.scss']
})
export class DataFilterComponent implements OnInit, OnChanges {

  @Input() filterConfig: FilterConfig;
  @Input() records: any[];

  @Output() filterChange = new EventEmitter<any[]>();
  selectedFiltersMap: SelectedFilters = {};
  private filterHelper: FilterHelper = new FilterHelper();
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filterConfig !== undefined && this.filterConfig) {
      this.filterConfig.filters.forEach(f => {
        this.selectedFiltersMap[f.name] = { path: f.filterPath, values: [] };
      })
    }
  }

  ngOnInit(): void {

  }

  onDropDownChange(event, filter: Filter) {
    const value = event?.target?.value
    const parsedValue = (filter.isBoolean ? JSON.parse(value) : value);    
    this.selectedFiltersMap[filter.name].values = [parsedValue];
    this.filterRecords();
  }


  onRadioChange(event, filter: Filter) {
    const value = event?.target?.value
    const parsedValue = (filter.isBoolean ? JSON.parse(value) : value);
    this.selectedFiltersMap[filter.name].values = [parsedValue];
    this.filterRecords();
  }

  onCheckBoxChange(event, filter: Filter) {
    const value = event?.target?.value
    if (event.target.checked) {
      this.selectedFiltersMap[filter.name].values.push(value);
    }
    else {
      this.selectedFiltersMap[filter.name].values = this.selectedFiltersMap[filter.name].values.filter(x => x !== value);
    }
    this.filterRecords();
  }

  filterRecords() {
    const filters = Object.values(this.selectedFiltersMap)
    const filteredRecords = this.filterHelper.filterRecords(this.records, filters)
    this.filterChange.emit(filteredRecords);
  }
}
