import { Component, Input, OnInit } from "@angular/core";
import { DataTable, SortEvent } from "./DataTable";
import { SortingService } from 'manager/src/static/app/service/sorting.service'
@Component({
    selector: "mfDefaultSorter",
    template: `
        <a style="cursor: pointer" (click)="sort(true)" class="text-nowrap">
            <ng-content></ng-content>
            <span *ngIf="isSortedByMeAsc" class="sort fa fa-fw fa-caret-up" aria-hidden="true" [ngClass]="{'mydeq-teal':isSortedByMeAsc}" aria-hidden="true"></span>
            <span *ngIf="!isSortedByMeAsc" class="sort fa fa-fw fa-caret-down" aria-hidden="true" [ngClass]="{'mydeq-teal':isSortedByMeDesc}" aria-hidden="true"></span>
        </a>`
})
export class DefaultSorter implements OnInit {
    @Input("by") sortBy: string;
    @Input() sortOrder: boolean = false;
    @Input() reqType: string = "";
    @Input() refreshEnableSort: boolean = false;
    orderby: any;

    isSortedByMeAsc: boolean = false;
    isSortedByMeDesc: boolean = false;

    public constructor(private mfTable: DataTable, private SortingService: SortingService) {

    }

    public ngOnInit(): void {
        this.mfTable.onSortChange.subscribe((event: SortEvent) => {
            this.isSortedByMeAsc = (event.sortBy == this.sortBy && event.sortOrder == "asc");
            this.isSortedByMeDesc = (event.sortBy == this.sortBy && event.sortOrder == "desc");
        });
        console.log(" this.isSortedByMeAsc", this.isSortedByMeAsc ,  this.isSortedByMeDesc)

    }
    ngAfterContentInit() {
            if (this.sortOrder) {
                this.sort(false);
            } 
    }

    sort(val) {

        this.mfTable.onSortChange.subscribe((event: SortEvent) => {
            this.isSortedByMeAsc = (event.sortBy == this.sortBy && event.sortOrder == "asc");
        });

        if (this.sortOrder && !val) {
            this.orderby = this.SortingService.getSortType(this.reqType + '-Sort', this.sortBy);
            this.mfTable.setSort(this.sortBy, this.orderby);
        } else {

            if (this.isSortedByMeAsc) {
                this.orderby = "desc";
            } else {
                this.orderby = "asc";
            }

            this.mfTable.setSort(this.sortBy,  this.orderby);
        }


        if (this.refreshEnableSort) {
            this.SortingService.setSortHeaderType(this.reqType + '-Sort', this.sortBy, this.orderby);
        }


    }
}
