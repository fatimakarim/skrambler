import "rxjs/add/operator/do";
import {
    HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse
} from "@angular/common/http";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {MatSnackBar} from "@angular/material";

import * as CONST_LIST from "../constants/constant-list";
import * as ROUTE_LIST from "../constants/routes-list";
import * as API_LIST from "../constants/apis-list";
import { LocalStorageService } from "../services/local-storage.service";
import { SessionStorageService } from "../services/session-storage.service";
import { SharedDataService } from "../../helpers/services/shared-data.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    protected constantList = CONST_LIST;
    protected routeList = ROUTE_LIST;

    protected whiteListAPI = [];

    constructor(private router: Router,
    private sessionService: SessionStorageService,
    private localService: LocalStorageService,
    private sharedDataService: SharedDataService,
    private snackBar: MatSnackBar) {
      this.whiteListAPI = [
        API_LIST.LOGIN_API,
        API_LIST.FORGOT_PASSWORD,
        API_LIST.RESET_PASSWORD,
      ];
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersObj = {
      "x-device-id": this.constantList.X_DEVICE_ID,
      "x-device-uuid": this.constantList.X_DEVICE_UUID
    };

    if (this.sessionService.get("skrambler_token")) {
      headersObj["Authorization"] = `Bearer ${this.sessionService.getToken()}`;
    }else{
      headersObj["Authorization"] = `Bearer ${this.localService.getToken()}`;
    }

    request = request.clone( {
      setHeaders: headersObj
    } );

    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // Updating the returned token
        this.sessionService.setDataInSessionStorage({
          key: "x-device-id",
          value: event.headers.get("x-device-id")
        });
        // if any response says, token not provided
        if (event.body.message === this.constantList.DEFAULT_INVALID_TOKEN_SERVER_RESPONSE ||
          event.body.message === this.constantList.DEFAULT_INVALID_TOKEN_SIGNATURE_SERVER_RESPONSE ||
          event.body.status === 401) {
          this.sessionService.cleatDataInSessionStorage();
          this.localService.clearDataInLocalStorage();
          this.sharedDataService.changeFormSubmitStatus(false);
          this.router.navigateByUrl(this.routeList.LOGIN).then();
          // dismiss all snack bars
          this.snackBar.dismiss();
        }
        // do stuff with response if you want
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.sharedDataService.changeFormSubmitStatus(false);
          this.sessionService.cleatDataInSessionStorage();
          this.localService.clearDataInLocalStorage();
          this.router.navigateByUrl(this.routeList.LOGIN).then();
          // dismiss all snack bars
          this.snackBar.dismiss();
        }
      }
    });
  }
}
