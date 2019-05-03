import { DataSource } from "@angular/cdk/table";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { CollectionViewer } from "@angular/cdk/collections";

import { Resource, ResourceService } from "../../services";
import { finalize, map } from "rxjs/operators";
import * as Constants from "../../../helpers/constants/constant-list";

export class TableDataSource extends DataSource<any> {
    private dataSubject = new BehaviorSubject<any[]>([]);
    public loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    public constants = Constants;
    public totalNumberOfPages = 1;
    public currentPage: number = this.constants.DEFAULT_PAGE_INDEX;
    public lastPage = 1;
    public pageSize: number = this.constants.NUMBER_RECORDS_PER_PAGE;
    public hasMore = true;
    public requestBody: any = {};

    /**
     * this boolean will make sure there is no second request if the first request has not returned
     */
    public isLoading = false;

    constructor(private _service: ResourceService<any>) {
        super();
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.dataSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.dataSubject.complete();
        this.loadingSubject.complete();
        this.isLoading = false;
    }

    changeLoader(bool: boolean = false) {
        if (bool !== this.loadingSubject.getValue()) {
            this.isLoading = bool;
            this.loadingSubject.next(bool);
        }
    }

    loadResource({ pageIndex, body = this.requestBody, filters = {} }:
        { pageIndex?: number, body?: any, filters?: Object }): void {
           
        this.isLoading = true;
        this.loadingSubject.next(true);

        if (!pageIndex) {
            pageIndex = 0;
        }

        const params = {
            page: pageIndex + 1,
        };

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (typeof value !== "undefined") {
                    params[key] = value;
                }
            });
        }
        if (body && body[this.constants.SEARCH] && !params[this.constants.SEARCH]) {
            params[this.constants.SEARCH] = body[this.constants.SEARCH];
        }

        this._service.fetch({ params, body }).pipe(
            map(response => {
                return response && response.data ? response.data : null;
            }),
            finalize(() => {
                this.loadingSubject.next(false);
                this.isLoading = false;
            })
        ).subscribe((resource: Resource) => {
            if (resource) {
                this.totalNumberOfPages = resource.total;
                this.currentPage = resource.page;
                this.lastPage = resource.last_page;
                this.pageSize = resource.per_page;
                this.hasMore = resource.has_more;
               
                this.dataSubject.next(resource.items);
            }
        });
    }

    getCurrentValue() {
        return this.dataSubject.getValue();
    }

    setParams(config: any) {
        this._service.setParameters(config.url, config.endpoint, config.method, config.contentType);
    }

    removeItemByIndex(index: number) {
        const items = this.getCurrentValue();
        if (items.length) {
            items.splice(index, 1);
            this.dataSubject.next(items);
        }
    }
}
