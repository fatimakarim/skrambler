import { Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import "rxjs/add/observable/of";
import { Observable } from "rxjs/Rx";
import { MatSnackBar } from "@angular/material";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import Fingerprint2 from "fingerprintjs2";

import { User } from "../models/User";
import * as API_LIST from "../constants/apis-list";
import * as ROUTE_LIST from "../constants/routes-list";
import * as CONSTANT_LIST from "../constants/constant-list";

import { DataService } from "../../theme-core/services";
import { SharedDataService } from "./shared-data.service";
import { LocalStorageService } from "./local-storage.service";
import { SessionStorageService } from "./session-storage.service";


@Injectable()
export class BaseNetworkService {

  protected localStorageService: LocalStorageService;
  protected sessionService: SessionStorageService;
  protected dataService: DataService;
  protected router: Router;
  protected http: HttpClient;
  protected constantList = CONSTANT_LIST;
  protected apiList = API_LIST;
  protected routeList = ROUTE_LIST;
  public user: User;
  public roles: any;
  private _headers: HttpHeaders;
  private _formDataHeaders: HttpHeaders;
  private snackBar: MatSnackBar;
  private _sharedDataService: SharedDataService;

  constructor(injector: Injector) {
    this.localStorageService = injector.get(LocalStorageService);
    this.sessionService = injector.get(SessionStorageService);
    this.dataService = injector.get(DataService);
    this.router = injector.get(Router);
    this.http = injector.get(HttpClient);
    this.snackBar = injector.get(MatSnackBar);
    this._sharedDataService = injector.get(SharedDataService);

    // First generating the unique fingerprint of the current device
    new Fingerprint2().get((result, components) => {
      this.initHeaders(result);
      this.initFormDataHeaders(result);
      this.localStorageService.set({ key: "skrambler_x_uuid", value: result });
      const token = this.localStorageService.getToken();
      if (token) {
        this._headers = this._headers.set("token", token);
        this._headers = this._headers.set("Authorization", `Bearer ${token}`);
        this._formDataHeaders = this._formDataHeaders.set("Authorization", `Bearer ${token}`);

        if (this.localStorageService.get("skrambler_x_id")) {
          this._headers = this._headers.set("x-device-id", this.localStorageService.get("skrambler_x_id"));
          this._formDataHeaders = this._formDataHeaders
            .set("x-device-id", this.localStorageService.get("skrambler_x_id"));
        }

        if (this.localStorageService.get("skrambler_x_uuid")) {
          this._headers = this._headers.set("x-device-uuid", this.localStorageService.get("skrambler_x_uuid"));
          this._formDataHeaders = this._formDataHeaders
            .set("x-device-uuid", this.localStorageService.get("skrambler_x_uuid"));
        }
      }
    });
  }

  /**
   * the following method is used to initialize headers for users
   */
  initHeaders(result = null): void {
    // HttpHeader class are immutable objects.
    this._headers = new HttpHeaders()
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Accept", "*/*");
    if (this.localStorageService.get("skrambler_token")) {
      this._headers = this._headers.set("Authorization", `Bearer ${this.localStorageService.get("skrambler_token")}`);
    }

    if (!this.localStorageService.get("skrambler_x_uuid")) {
      this.localStorageService.set({ key: "skrambler_x_uuid", value: this.constantList.X_DEVICE_UUID });
    }

    if (this.localStorageService.get("skrambler_x_id")) {
      this._headers = this._headers.set("x-device-id", this.localStorageService.get("skrambler_x_id"));
    }

    this._headers = this._headers
      .set("x-device-uuid", result ? result : this.localStorageService.get("skrambler_x_uuid"));
  }

  /**
   * the following method is used to initialize headers for form render
   */
  initFormDataHeaders(result = null): void {
    // HttpHeader class are immutable objects.
    this._formDataHeaders = new HttpHeaders()
      .set("Accept", "*/*");
    if (this.localStorageService.get("skrambler_token")) {
      this._formDataHeaders = this._formDataHeaders
        .set("Authorization", `Bearer ${this.localStorageService.get("skrambler_token")}`);
    }

    if (!this.localStorageService.get("skrambler_x_uuid")) {
      this.localStorageService.set({ key: "skrambler_x_uuid", value: this.constantList.X_DEVICE_UUID });
    }

    if (this.localStorageService.get("skrambler_x_id")) {
      this._formDataHeaders = this._formDataHeaders
        .set("x-device-id", this.localStorageService.get("skrambler_x_id"));
    }

    this._formDataHeaders = this._formDataHeaders
      .set("x-device-uuid", this.localStorageService.get("skrambler_x_uuid"));
  }

  /**
   * the following method is used to get the updated token
   */
  updateToken(): void {
    const token = this.localStorageService.get("skrambler_token");
    if (token) {
      this._headers = this._headers.set("Authorization", `Bearer ${token}`);
      this._formDataHeaders = this._formDataHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  /**
   * The following method is used to update the headers
   */
  get headers(): HttpHeaders {
    if (!this._headers) {
      this.initHeaders();
    }

    const token = this.localStorageService.get("skrambler_token");
    if (token && !this._headers.get("Authorization")) {
      this._headers = this._headers.set("Authorization", `Bearer ${token}`)
        .set("token", this.localStorageService.get("skrambler_token"));
    }

    return this._headers;
  }

  set headers(value: HttpHeaders) {
    this._headers = value;
  }

  get formDataHeaders(): HttpHeaders {
    if (!this._formDataHeaders) {
      this.initFormDataHeaders();
    }

    const token = this.localStorageService.get("skrambler_token");
    if (token && !this._formDataHeaders.get("Authorization")) {
      this._formDataHeaders = this._formDataHeaders.set("Authorization", `Bearer ${token}`)
        .set("token", this.localStorageService.get("skrambler_token"));
    }

    return this._formDataHeaders;
  }

  set formDataHeaders(value: HttpHeaders) {
    this._formDataHeaders = value;
  }

  /**
   * The following method converts
   * @param json
   * @returns {any}
   */
  parseResponse(json: any): any {
    return <any>json;
  }

  /**
   * The following method is used to check whether the request was unauthorised or not
   * @param error
   */
  isRequestUnauthorized(error) {
    if (error.status === 401) {
      this.router.navigateByUrl(this.routeList.LOGIN).then(() => {
        this._sharedDataService.changeFormSubmitStatus(false);
        this.localStorageService.clearDataInLocalStorage();
      });
    }
  }

  /**
   * The following method is used to get the error messages from the response
   * @param json
   * @returns {any}
   */
  getErrorMessages(json): any {
    const errors = [];
    if (json && json.data && json.data.errors) {
      Observable.range(0, Object.keys(json.data.errors).length).subscribe(
        index => {
          // the following first gets the all the Keys in the errors,
          // then based on the current index of iteration gets the respective error key value pair
          errors.push(json.data.errors[Object.keys(json.data.errors)[index]]);
        },
        err => {
          errors.push(err);
        },
        () => {
          if (!errors.length && json.message) {
            errors.push(json.message);
          }
        });
    }

    if (!errors.length) {
      errors.push(this.constantList.DEFAULT_ERROR_MESSAGE);
    }
    return errors;
  }

  handleErrorMessages(json) {
    const errors = this.getErrorMessages(json);
    this.showMessage(Array.isArray(errors) ? errors[0] : errors);
  }

  showMessage(msg: string) {
    this.snackBar.open(msg, this.constantList.DEFAULT_SNACKBAR_LABEL, {
      duration: this.constantList.DEFAULT_SNACKBAR_DURATION,
      verticalPosition: "bottom"
    }
    );
  }

  rejectErrorMessages(errorData, reject) {
    this.getErrorMessages(errorData.error).then((errorsArray) => {
      // if errorsArray returned, give it back to the component
      if (errorsArray) {
        reject(errorsArray);
      }
    });
  }
}
