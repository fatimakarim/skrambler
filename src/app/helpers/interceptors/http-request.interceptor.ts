import "rxjs/add/operator/do";
import {
    HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse,
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import { Injectable, Injector } from "@angular/core";
import { SharedDataService } from "../services/shared-data.service";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

    constructor(public router: Router,
        public sharedDataService: SharedDataService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // this.sharedDataService.changeFormSubmitStatus(false);
            } else {
                this.sharedDataService.changeFormSubmitStatus(true);
                this.sharedDataService.showLoadingBar(true);
            }
        }, (err: any) => {
            this.sharedDataService.changeFormSubmitStatus(false);
            /*if (err instanceof HttpErrorResponse)
                this.sharedDataService.showLoadingBar(false);*/
        })
        .finally(() => {
            this.sharedDataService.showLoadingBar(false);
            this.sharedDataService.changeFormSubmitStatus(false);
        });
    }
}
