import "rxjs/add/operator/do";
import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse,
  HttpEventType
} from "@angular/common/http";
import {Observable} from "rxjs";
import { interval } from 'rxjs/observable/interval';
import * as CONST_LIST from "../constants/constant-list";
import * as ROUTE_LIST from "../constants/routes-list";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material";

@Injectable()
export class TimerInterceptor implements HttpInterceptor {
  protected constantList = CONST_LIST;
  protected routeList = ROUTE_LIST;
  /**
   * to keep the track of no. of requests triggered
   * @type {number}
   */
  protected requestCount: number = 0;

  /**
   * to keep track whether the snackbar is opened or not
   * @type {boolean}
   */
  protected isSnackBarOpen: boolean = false;

  constructor(public router: Router,
              public snackBar: MatSnackBar) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.requestCount++;

    // the following will emit every 3 seconds until all requests have returned
    interval(this.constantList.DEFAULT_REQUEST_LONG_TIME_INTERVAL).takeWhile((value) => this.requestCount > 0).subscribe(val => {
      // to make sure the snack bar is not already opened
      if (!this.isSnackBarOpen) {
        this.snackBar.open(this.constantList.DEFAULT_REQUEST_TOO_LONG_TEXT);
        this.isSnackBarOpen = true;
      }
    });

    return next.handle(request).do((event: HttpEvent<any>) => {

      if (event instanceof HttpResponse) {
        this.requestCount--;
        // once the request count has exhausted i.e. all requests have returned then simple dismiss the rendered snack bar
        if (this.requestCount == 0) {
          this.snackBar.dismiss();
          this.isSnackBarOpen = false;
        }
        // if any response says, token not provided
        if (event.body.message === this.constantList.DEFAULT_INVALID_TOKEN_SERVER_RESPONSE ||
          event.body.message === this.constantList.DEFAULT_INVALID_TOKEN_SIGNATURE_SERVER_RESPONSE) {
          this.router.navigateByUrl(this.routeList.LOGIN).then();
        }
      }

      // Look for upload progress events.
      /*if (event.type === HttpEventType.UploadProgress) {
        // This is an upload progress event. Compute and show the % done:
        const percentDone = Math.round(100 * event.loaded / event.total);
        let msg: string = `File(s) uploaded: ${percentDone}`;
        if (percentDone == 100) {
          msg = "File(s) uploaded waiting for server response";
        }

        this.snackBar.open(msg);
      }*/
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        this.isSnackBarOpen = true;
      }
    });
  }
}
