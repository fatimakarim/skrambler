import { Component, ViewEncapsulation, Injector, ViewChild, Input } from "@angular/core";

import { SkramblerBaseComponent } from "./base.component";
import { MatTableDataSource, MatDialog } from "@angular/material";
import { TableDataSource } from "../../theme-core/components/table/table.datasource";
import { SkramblerTableComponent } from "../../theme-core/components/table/table.component";
import { Subscription } from "rxjs";
import { DialogComponent } from "./dialog/dialog.component";
import { debounceTime, distinctUntilChanged, skip } from "rxjs/operators";

/*
 * Base Component
 * Top Level Component
 */
@Component({
    selector: "skrambler-listing-base-component",
    encapsulation: ViewEncapsulation.None,
    template: ""
})
export class SkramblerListingBaseComponent extends SkramblerBaseComponent {

    get pageIndex(): number {
        return this._pageIndex;
    }

    set pageIndex(value: number) {
        this._pageIndex = value;
    }

    constructor(injector: Injector) {
        super(injector);
        this.dialog = injector.get(MatDialog);
    }


    /**
     * The following acts as the filters of the data table
     * @type {any[]}
     */
    public paramsFilter: any[] = [];

    /**
     * The following acts as the columns for the pagination of the data table
     * @type {any[]}
     */
    public displayedColumnsViewArray: any[] = [];

    /**
     * The following acts to delete record  from the data table
     * @type {any[]}
     */
    public deletedItemId: number | string = "";

    /**
     * The following acts as the api resource configuration for the pagination of the data table
     * @type {any}
     */
    public endPointConfiguration: any = {};



    /**
     * The following acts as the data source for the pagination of the data table
     * @type {MatTableDataSource<any>}
     */
    public dataSource = new MatTableDataSource();

    private _pageIndex: number = this.constantList.DEFAULT_PAGE_INDEX;

    protected dialog: MatDialog;

    /**
     * the following holds reference to the search subscription , which needs to be unsubscribe when respective component is destroyed from view
     */
    protected searchSubscription$: Subscription;

    @ViewChild(SkramblerTableComponent) table: SkramblerTableComponent;
    any;
    ngOnDestroy() {
        // to make sure the search subscriber is remove on this component being destroyed from view heiarchy
        if (this.searchSubscription$) {
            this.searchSubscription$.unsubscribe();
        }
    }

    /**
     * the following method is used to setup the search bar subscriber
     */
    setupSearchSubscriber() {
        // the following will subscribe to any changes in search field and trigger the respective search method
        this.searchSubscription$ = this.sharedDataService.searchQuery.pipe(
            debounceTime(1000),
            distinctUntilChanged(),
            skip(1))
            .subscribe(message => {
                if (message !== "" &&
                    message !== null &&
                    parseInt(message, 10) !== -1 &&
                    !!message !== false &&
                    typeof message !== "undefined") {
                    this.pageIndex = this.constantList.DEFAULT_PAGE_INDEX;
                    if (this.table) {
                        this.table.paginator.pageIndex = this.pageIndex;
                        if (this.table.dataSource) {
                            this.table.requestBody[this.constantList.SEARCH] = message;
                            this.table.loadResourcesPage(this.constantList.DEFAULT_PAGE_INDEX);;
                        }
                    }
                }
                // if -1 then the collapse was called from the search bard 
                else if (parseInt(message, 10) === -1) {
                    delete this.table.requestBody[this.constantList.SEARCH];
                    // for cases where user enters empty text to search, but making sure datasource is initialized already
                    if (this.table.dataSource) { this.table.loadResourcesPage(this.constantList.DEFAULT_PAGE_INDEX);; }
                }
            });
    }

    /*
     * check element if exist to add it or update the value of it
     */
    checkAndAdd(key: string, value: any) {
        if (this.paramsFilter.length === 0) {
            this.paramsFilter.push({ key: key, value: value });
        } else {
            const found = this.paramsFilter.some(function (el) {
                return el.key === key;
            });

            if (!found) {
                this.paramsFilter.push({ key: key, value: value });
            } else {
                for (let index = 0; index < this.paramsFilter.length; index++) {
                    if (this.paramsFilter[index].key === key) {
                        this.paramsFilter[index].value = value;
                    }
                }
            }
        }
    }

    /*
    * The following method is used to check if key exist or not
    */
    checkKey(key: string) {
        return this.paramsFilter.some(function (el) {
            return el.key === key;
        });
    }

    /*
     * remove specific key from array
     */
    removeByKey(key: string): void {
        const index = this.paramsFilter.findIndex(item => item.key === key);
        if (index) {
            this.paramsFilter.splice(index, 1);
        }
    }
    confirmDeleteItem(options?: any) {
        return this.dialog.open(DialogComponent, {
            width: this.constantList.POP_UP_DEFAULT_WIDTH,
            data: {
                title: options && options.title ? options.title : "Confirmation",
                text: options && options.text ? options.text : "Are you sure you want to delete this record?",
            }
        });
    }
}
