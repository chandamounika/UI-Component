import {Component, Input, OnInit} from "@angular/core";
import {DataTable, SortEvent} from "./DataTable";

@Component({
    selector: "mfDefaultSorter",
    template: `
        <a style="cursor: pointer" (click)="sort()" class="text-nowrap">
            <ng-content></ng-content>
            <span *ngIf="isSortedByMeAsc" class="sort fa fa-fw fa-caret-up" aria-hidden="true" [ngClass]="{'text-primary':isSortedByMeAsc}" aria-hidden="true"></span>
            <span *ngIf="!isSortedByMeAsc" class="sort fa fa-fw fa-caret-down" aria-hidden="true" [ngClass]="{'text-primary':isSortedByMeDesc}" aria-hidden="true"></span>
        </a>`
})
export class DefaultSorter implements OnInit {
    @Input("by") sortBy: string;
    
    isSortedByMeAsc: boolean = false;
    isSortedByMeDesc: boolean = false;

    public constructor(private mfTable: DataTable) {
    }

    public ngOnInit(): void {
        this.mfTable.onSortChange.subscribe((event: SortEvent) => {
            this.isSortedByMeAsc = (event.sortBy == this.sortBy && event.sortOrder == "asc");
            this.isSortedByMeDesc = (event.sortBy == this.sortBy && event.sortOrder == "desc");
        });
    }

    sort() {
        if (this.isSortedByMeAsc) {
            this.mfTable.setSort(this.sortBy,"desc");
        } else {
            this.mfTable.setSort(this.sortBy, "asc");
        }
    }
}
