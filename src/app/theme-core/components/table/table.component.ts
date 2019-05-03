import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    HostListener,
    Injector
} from "@angular/core";
import { MatSelectChange, MatPaginator, PageEvent } from "@angular/material";
import { throttle } from "lodash";
import { DataService, ResourceService } from "../../services";
import { TableDataSource } from "./table.datasource";
import * as Constants from "../../../helpers/constants/constant-list";
import { SkramblerBaseComponent } from "../../../helpers/components/base.component";
import { debounceTime, distinctUntilChanged, tap, pluck } from "rxjs/operators";
import { Observable } from "rxjs";

enum scrollDirection {
    UP = "up",
    DOWN = "down"
}

enum scrollListener {
    HOST = "scroll",
    WINDOW = "window:scroll"
}

@Component({
    selector: "skrambler-resource-table",
    templateUrl: "./table.component.html",
    styleUrls: ["./table.component.scss"]
})
export class SkramblerTableComponent extends SkramblerBaseComponent implements OnInit, AfterViewInit, OnChanges {
    public dataSource: TableDataSource;
    public selectedStatus: number;

    public sortKey: string = this.constantList.DEFAULT_SORT_KEY;
    public sortOrder: string = this.constantList.DEFAULT_SORT_ORDER;

    @Input() displayedColumnsViewArray: any[] = [];

    /**
     * API configuration object
     * @type {url: string; endpoint: string; method: string; contentType: string}
     */
    @Input()
    endPointConfiguration: {
        url: string;
        endpoint: string;
        method: string;
        contentType: string;
    } = {
            url: "",
            endpoint: "",
            method: "GET",
            contentType: "application/x-www-form-urlencoded"
        };

    @Input() triggerChange: any = {};

    /**
     * Optional Request body
     * @type {{}}
     */
    @Input() requestBody: any = {};

    @Input() paramFilters: any[] = [];

    @Output() elementClick: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild("input") input: ElementRef;

    displayedColumns: any[] = [];
    filters: any[] = [];
    params: Object = {};

    private _resourceService: ResourceService<any>;

    constructor(private _dataService: DataService,
        private elRef: ElementRef,
        injector: Injector) {
        super(injector);
        this._dataService = _dataService;
    }

    ngOnInit() {
        this.filters = this.paramFilters;
        this.displayedColumns = this.displayedColumnsViewArray.map(
            (column: { key: string; value: string }) => column.key
        );

        this._resourceService = new ResourceService<any>(this._dataService);
        this._resourceService.setParameters(
            this.endPointConfiguration.url,
            this.endPointConfiguration.endpoint,
            this.endPointConfiguration.method,
            this.endPointConfiguration.contentType
        );

        this.dataSource = new TableDataSource(this._resourceService);
        this.dataSource.requestBody = this.requestBody;

        const option = {};
        if (this.selectedStatus) {
            option["status"] = this.selectedStatus;
        }

        this.dataSource.loadResource(option);
        this.paginator.page
            .pipe(
                tap(() => {
                    if (this.selectedStatus) {
                        this.loadResourcesPage(this.paginator.pageIndex);
                    } else { this.loadResourcesPage(this.paginator.pageIndex); }
                })
            )
            .subscribe();
    }

    ngAfterViewInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (
            changes["triggerChange"] &&
            !changes["triggerChange"].firstChange &&
            changes["triggerChange"].currentValue
        ) {
            this.dataSource.removeItemByIndex(parseInt(changes["triggerChange"].currentValue, 10));
        }
    }

    pageChanged($event: PageEvent) {
        this.paginator.pageIndex = $event.pageIndex;
        this.dataSource.changeLoader(true);
    }

    loadResourcesPage(pageIndex?: any): void {
        const index = pageIndex !== "undefined" ? pageIndex : this.paginator.pageIndex;
        this.paginator.pageIndex = index;
        this.dataSource.loadResource({ pageIndex: index, filters: this.params });
    }

    onSelectChange(event: MatSelectChange, filterKey?: null) {
        const status = event.value;
        this.paginator.pageIndex = this.constantList.DEFAULT_PAGE_INDEX; // reset pagination to initial value
        this.loadResourcesPage(this.paginator.pageIndex);
    }

    onSearchClick($event: { params: any, filters: any }) {
        if ($event.params) {
            this.params = $event.params;
            this.paginator.pageIndex = this.constantList.DEFAULT_PAGE_INDEX; // reset pagination to initial value
            this.loadResourcesPage(this.paginator.pageIndex);
        }
    }

    emitEvent(element: any, action: { key: string; value: string }) {
        this.elementClick.emit({ element: element, action: action.key });
    }

    emitLinkEvent(element: any, action: { key: string; value: string }) {
        this.elementClick.emit({ element: element, action: action });
    }
    /**
     * the following is only written for fetching nested array of object for sub-categories name
     * @param element 
     * @param column 
     */
    constructCategoriesNestedArrayObject(
        element,
        column: {
            key: string;
            value: string;
            type: string;
            map: object;
            callback: Function;
        }
    ) {
        let subCategories = "";
        if (element.brand_sub_categories[0]) { subCategories += element.brand_sub_categories[0].sub_category.name; }
        if (element.brand_sub_categories[1]) { subCategories += ", " + element.brand_sub_categories[1].sub_category.name; }
        if (element.brand_sub_categories[2]) { subCategories += ", " + element.brand_sub_categories[2].sub_category.name; }
        return subCategories;
    }

    constructBranchesNestedArrayObjects(
        element,
        column: {
            key: string;
            value: string;
            map: object;
            type: string;
            callback: Function;
        }
    ) {
        const branches = element.branch_offer;
        const branchNames = branches.map(function (branch) {
            return branch.name;
        }).join(",");
        return branchNames;
    }
    /*
    * @param column 
    * @param element 
    * the following method is used to get the branches name 
   */
    constructCancatinateColumn(element) {
        return element.profile["first_name"] + " " + element.profile["last_name"];
    }

    constructOfferUserName(element) {
        return element.user.profile["first_name"] + " " + element.user.profile["last_name"];
    }

    constructImpressionsForCampaign(element) {
        if (element["max_impressions"] == null) {
            return "";
        }
        else {
            return element["left_impressions"] == null ? 0 : element["left_impressions"] + " out of "
                + element["max_impressions"];
        }

    }

    constructYetToBeRedemmedOffers(element) {
        if (element["max_allowed_offers"] === 0 || element["max_allowed_offers"] == null) {
            return "";
        }
        else {
            const max_allowed_offers = element["max_allowed_offers"] == null ? 0 : element["max_allowed_offers"];
            const redeemed_count = element["redeemed_count"] == null ? 0 : element["redeemed_count"];

            return (max_allowed_offers - redeemed_count) + " out of " + max_allowed_offers;
        }

    }

    // Used in Users listing
    constructUserFullName(element) {
        return element["first_name"] + " " + element["last_name"];
    }

    constructDateOfBirth(element) {
        return element.profile["dob"] ? this.calculateAge(element.profile["dob"].toString()) : "N/A";
    }

    constructAge(element): string { // birthday is a date
        return this.calculateAge(element.user.profile.dob);
    }

    calculateAge(dob: string){
      const timeDiff = Math.abs(Date.now() - new Date(dob).getTime());
      return Math.floor(timeDiff / (1000 * 3600 * 24) / 365).toString();
    }

    constructCustomerPoints(element) {
        return element["points"] === "" ? 0 : element["points"];
    }



    /**
     * the following method is used to generate google map location string
     */
    constructLocationObject(
        element,
        column: {
            key: string;
            value: string;
            type: string;
            map: object;
            callback: Function;
        }
    ) {
        return `https://www.google.com/maps/?q=${element.latitude},${element.longitude}`;
    }

    constructNestedObject(
        element,
        column: {
            key: string;
            value: string;
            type: string;
            map: object;
            callback: Function;
        }
    ) {
        if (!column.key && !column.callback) {
            return "";
        } else if (!column.key && column.callback) {
            return column.callback.call(column.callback, <any>element);
        }

        const key =
            column.key.split(".").length > 1
                ? this.getNestedPropertyValue(element, column.key)
                : column.key;
        if (key && key !== column.key) {
            return column.map ? column.map[key] ? column.map[key] : key : key;
        }

        if ((!key || !element[key]) && !column.callback && !column.map) {
            return "";
        }

        if ((!key || !element[key]) && column.callback) {
            return column.callback.call(column.callback, <any>element);
        }

        if (column.key.indexOf(".") > -1 && !column.map) {
            return key;
        }

        if (!element[key] && !column.map) {
            return "";
        }

        if (column.callback) {
            return column.callback.call(column.callback, <any>element[key]);
        }

        return column.map
            ? column.map[key]
                ? column.map[key]
                : column.map[element[key]]
            : element[key];
    }

    constructImage(element, column: { key: string }): any {
        return element[column.key];
    }

    getNestedPropertyValue(
        theObject: any,
        path: string,
        separator = "."
    ): string {
        try {
            separator = separator || ".";

            return path
                .replace("[", separator)
                .replace("]", "")
                .split(separator)
                .reduce(function (obj, property) {
                    return obj[property];
                }, theObject);
        } catch (err) {
            return "";
        }
    }

    sortTable(column: any) {
        if (column.sortable) {
            this.sortKey = column.sort_key || column.key;
            this.sortOrder = this.sortOrder === this.constantList.DEFAULT_SORT_ORDER
                ? "ASC" : this.constantList.DEFAULT_SORT_ORDER;

            this.paginator.pageIndex = this.constantList.DEFAULT_PAGE_INDEX;
            this.setParams();

            this.dataSource.setParams(this.endPointConfiguration);
            this.loadResourcesPage();
        }
    }

    setParams() {
        if (this.endPointConfiguration.endpoint) {
            if (this.endPointConfiguration.endpoint.indexOf("sort_key") === -1) {
                this.endPointConfiguration.endpoint += `?sort_key=${this.sortKey}`;
            } else {
                this.endPointConfiguration.endpoint = this.endPointConfiguration.endpoint
                    .replace(/(sort_key=)[^\&]+/, "$1" + this.sortKey);
            }

            if (this.endPointConfiguration.endpoint.indexOf("sort_order") === -1) {
                if (this.endPointConfiguration.endpoint.indexOf("?") > -1) {
                    this.endPointConfiguration.endpoint += `&sort_order=${this.sortOrder}`;
                } else {
                    this.endPointConfiguration.endpoint += `?sort_order=${this.sortOrder}`;
                }
            } else {
                this.endPointConfiguration.endpoint = this.endPointConfiguration.endpoint
                    .replace(/(sort_order=)[^\&]+/, "$1" + this.sortOrder);
            }
        } else {
            if (this.endPointConfiguration.url.indexOf("sort_key") === -1) {
                this.endPointConfiguration.url += `?sort_key=${this.sortKey}`;
            } else {
                this.endPointConfiguration.url = this.endPointConfiguration.url
                    .replace(/(sort_key=)[^\&]+/, "$1" + this.sortKey);
            }

            if (this.endPointConfiguration.url.indexOf("sort_order") === -1) {
                if (this.endPointConfiguration.url.indexOf("?") > -1) {
                    this.endPointConfiguration.url += `&sort_order=${this.sortOrder}`;
                } else {
                    this.endPointConfiguration.url += `?sort_order=${this.sortOrder}`;
                }
            } else {
                this.endPointConfiguration.url = this.endPointConfiguration.url
                    .replace(/(sort_order=)[^\&]+/, "$1" + this.sortOrder);
            }
        }
    }
}
