import { AfterContentChecked, AfterContentInit, AfterViewInit, ComponentFactory, ComponentFactoryResolver, ComponentRef, ContentChildren, Directive, ElementRef, Input, OnInit, QueryList, Renderer2, ViewContainerRef } from "@angular/core";
import { FilterOptionsComponent } from "./filter-options/filter-options.component";
import { FilterEngine } from "./FilterEngine";
import { Paginator } from "./Paginator";
import { TablefooterComponent } from "./tablefooter/tablefooter.component";

export interface FilterEvent {
    column: string,
    selected_filter_values: any[]
}

@Directive({
    selector: 'th[filter]'
})
export class DeqTableHeaders implements AfterContentChecked, AfterViewInit {

    @Input('columnname') columnname = ''
    @Input('displayheader') displayheader = ''
    @Input('filtervalues') filtervalues = []
    @Input('selectedFiltersHandler') selectedFiltersHandler
    //@Output('selectedFilters') selected_filters = new EventEmitter<FilterEvent>()

    private componentFactory: ComponentFactory<any>;
    private _filteroption: ComponentRef<FilterOptionsComponent>
    private filterInstance

    constructor(private el: ElementRef, private renderer: Renderer2,
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver) {
        this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(FilterOptionsComponent);
        this._filteroption = this.viewContainerRef.createComponent(this.componentFactory)
        this.filterInstance = this._filteroption.instance
    }

    ngAfterContentChecked(): void {
        setTimeout(() => {
            this.filterInstance.option_list = this.filtervalues
        }, 0)
    }

    ngAfterViewInit() {
        this.filterInstance.option_list = this.filtervalues
        this.filterInstance.filter_type = 'CHECKBOX'
        this.filterInstance.column_header = this.columnname
        this.filterInstance.display_header = this.displayheader
        this.filterInstance.filterChangeHandler = () => this.selectedFiltersHandler

        this.renderer.appendChild(this.viewContainerRef.element.nativeElement, this._filteroption.location.nativeElement)
    }

}

@Directive({
    selector: 'th'
})
export class GeneralColumnHeaders { }

@Directive({
    selector: 'table[deqTable]',
    exportAs: 'deqDataTable'
})
export class DeqTable implements OnInit, AfterContentInit {

    @ContentChildren(DeqTableHeaders, { descendants: true }) headers: QueryList<DeqTableHeaders>;
    @ContentChildren(GeneralColumnHeaders, { descendants: true }) general_headers: QueryList<GeneralColumnHeaders>;

    @Input('deqTable') inputList = []
    @Input('records_per_page') records_per_page = 10

    public records //To be exposed to html for iterating
    private searched_records

    private columnlist = []
    private filterengine: FilterEngine
    private filterMetadata

    private componentFactory: ComponentFactory<any>;
    private _tableFooter: ComponentRef<TablefooterComponent>
    private _tableFooterInstance
    private paginator = new Paginator()

    constructor(private el: ElementRef, private renderer: Renderer2,
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver) {

        this.filterengine = new FilterEngine()

        this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(TablefooterComponent);
        this._tableFooter = this.viewContainerRef.createComponent(this.componentFactory)
        this._tableFooterInstance = this._tableFooter.instance
    }

    private get_latest_filters = (headerName, filtermetadta) => {
        return Array.from(filtermetadta.get(headerName).keys()).sort()
    }

    ngAfterContentInit() {
        this.columnlist = this.headers.map(item => item.columnname)
        this.searched_records = this.inputList
        if (this.inputList && this.inputList.length > 0) {
            this.filterMetadata = this.filterengine.init(this.inputList, this.columnlist)
            this.update_recordset_and_filter()
        } else {
            this.records = this.inputList
        }



        let filter_list = this.filterengine.get_updated_filter_list(this.filterMetadata)
        this.headers.forEach(header => {

            header.filtervalues = this.get_latest_filters(header.columnname, filter_list)
            header.selectedFiltersHandler = (selected_filter_details) => {

                this.filterengine.update_filter_state(this.filterMetadata,
                    selected_filter_details.column_name,
                    selected_filter_details.selected_values,
                    this.columnlist,
                    this.inputList)
                this.update_recordset_and_filter()
                this.ref_calculate_pagination()
            }
        });

        this.add_table_footer(this.searched_records.length, this.records_per_page, this.general_headers.length, this.renderer)

    }

    ngOnInit(): void {

        /* if (this.inputList && this.inputList.length > 0) {
            this.filterMetadata = this.filterengine.init(this.inputList, this.columnlist)
            this.update_recordset_and_filter()
        } else {
            this.records = this.inputList
        } */
    }

    private update_recordset_and_filter = () => {
        //this.records = this.filterengine.get_filtered_records(this.inputList, this.filterMetadata)
        this.searched_records = this.filterengine.get_filtered_records(this.inputList, this.filterMetadata)

        if (this.headers) {
            let filter_metadata = this.filterengine.get_updated_filter_list(this.filterMetadata)
            this.headers.forEach(header => {
                header.filtervalues = this.get_latest_filters(header.columnname, filter_metadata)
            })
        }
    }


    // Page Footer Operations
    private is_wintin_range = (page_num, _current_state) => page_num > 0 && page_num <= _current_state.totalpages
    private update_pagination_state = new_state => {
        this._tableFooterInstance.pagination_details = new_state
        this.records = this.searched_records.slice(new_state.active_page_record_range.lowerIndex, new_state.active_page_record_range.upperIndex + 1)
    }

    public goto_page = (page_num, current_state) => {
        if (this.is_wintin_range(page_num, current_state)) {
            this.update_pagination_state(this.paginator.goto_page(page_num, current_state))
        }
    }
    public move_forward = (_current_state) => {
        this.update_pagination_state(this.paginator.move_forward(_current_state))
    }
    public move_backward = (_current_state) => {
        this.update_pagination_state(this.paginator.move_backward(_current_state))
    }

    private ref_calculate_pagination=()=>{
        this.update_pagination_state( this.paginator.initiate_paginator(this.searched_records.length,this.records_per_page))
    }


    private add_table_footer = (total_records, page_size, column_count, renderer: Renderer2) => {

        //totalrecords,recordsperpage,pagingwindowsize
        this.update_pagination_state(this.paginator.initiate_paginator(total_records, page_size))
        this._tableFooterInstance.go_to_page = this.goto_page
        this._tableFooterInstance.move_forward = this.move_forward
        this._tableFooterInstance.move_backward = this.move_backward

        let tfoot = renderer.createElement('tfoot')
        let tr = renderer.createElement('tr')
        let td = renderer.createElement('td')
        renderer.setAttribute(td, "colspan", column_count)
        this.renderer.appendChild(td, this._tableFooter.location.nativeElement)

        renderer.appendChild(tr, td)
        renderer.appendChild(tfoot, tr)

        this.renderer.appendChild(this.viewContainerRef.element.nativeElement, tfoot)
    }

}