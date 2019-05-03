import { Component, ViewEncapsulation, Injector, ChangeDetectorRef, HostBinding } from "@angular/core";
import { Location } from "@angular/common";
import * as $ from "jquery";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { MatSnackBar } from "@angular/material";
import { Observable } from "rxjs/Rx";
import "rxjs/add/observable/of";

import * as CONST_LIST from "../constants/constant-list";
import * as ROUTE_LIST from "../constants/routes-list";
import * as API_LIST from "../constants/apis-list";
import { SkramblerTranslationLoaderService } from "../../theme-core/services";
import { UserService } from "../services/user.service";
import { DataListingService } from "../services/data-listing.service";
import { BaseModel } from "../models/BaseModel";
import { HelperService } from "../services/helper.service";
import { PermissionService } from "../services/permission.service";
import { SharedDataService } from "../services/shared-data.service";
import {DomSanitizer} from "@angular/platform-browser";

/*
 * Base Component
 * Top Level Component
 */
@Component({
  selector: "skrambler-base-component",
  encapsulation: ViewEncapsulation.None,
  template: ""
})
export class SkramblerBaseComponent {

  public FAILED_STATUS = true;
  public SUCCESS_STATUS = false;
  public ERROR_MSG: any;
  public constantList = CONST_LIST;
  // kept public as its used in templates as well
  public routeList = ROUTE_LIST;
  public apiList = API_LIST;
  public router: Router;
  public route: ActivatedRoute;
  public userService: UserService;
  public dataListService: DataListingService;
  public translationLoader: SkramblerTranslationLoaderService;
  public translate: TranslateService;
  public snackBar: MatSnackBar;
  public location: Location;
  public helperService: HelperService;
  public permissionService: PermissionService;
  public cd: ChangeDetectorRef;
  public sharedDataService: SharedDataService;
  public sanitizer: DomSanitizer;

  /**
   * the following boolean make sure to disable the button once the form is submitted
   * @type {boolean}
   */
  private _isFormSubmitted;
  /**
   * the following variable will allow us to downcast this instance to respective child instance whenever required
   */
  public baseModel;

  @HostBinding("class.overflow") someField = true;

  constructor(injector: Injector) {
    this.router = injector.get(Router);
    this.cd = injector.get(ChangeDetectorRef);
    this.location = injector.get(Location);
    this.snackBar = injector.get(MatSnackBar);
    this.route = injector.get(ActivatedRoute);
    this.userService = injector.get(UserService);
    this.dataListService = injector.get(DataListingService);
    this.translate = injector.get(TranslateService);
    this.translationLoader = injector.get(SkramblerTranslationLoaderService);
    // this.baseModel = new BaseModel();
    this.helperService = injector.get(HelperService);
    this.permissionService = injector.get(PermissionService);
    this.sharedDataService = injector.get(SharedDataService);
    this.sanitizer = injector.get(DomSanitizer);
  }

  /**
   * To get the FormSubmitted Value
   * @returns {boolean}
   */
  get isFormSubmitted(): boolean {
    return this._isFormSubmitted;
  }

  /**
   * To set the FormSubmitted Value
   * @param {boolean} value
   */
  set isFormSubmitted(value: boolean) {
    // updating the shared variable that is shared across the app, even by those which do not inherit from Skrambler Base Component

    setTimeout(() => {
      // this.cd.detectChanges();
      this.helperService.isFormSubmittedSharedVariable = value;
      this._isFormSubmitted = value;
    }, 250);
  }

  /**
   * The following method is used to take the user to a link, with delay if given
   * @param {string} link
   * @param {number} delay
   */
  goTo(link: string, delay?: number): void {
    if (delay) {
      Observable.timer(delay)
        .subscribe(() => {
          this.router.navigateByUrl(link).then();
        });
    } else {
      this.router.navigateByUrl(link).then();
    }
  }

  /**
   * The following method is used to show the snack bar with respective message
   * @param message
   */
  showSnackBarWithMessage(message): void {
    this.snackBar.open(Array.isArray(message) ? message[0] : message,
      this.constantList.DEFAULT_SNACKBAR_LABEL,
      {
        duration: this.constantList.DEFAULT_SNACKBAR_DURATION,
        verticalPosition: "bottom"
      }
    );
  }

  /**
   * The following check if its edit mode
   * @returns {string | null}
   */
  isEditMode(): string | null {
    return this.route.snapshot.paramMap.get("id");
  }

  statusToggleChanged(event: any): void {
    // getting div > span > strong element to set the updated text
    event.source._elementRef.nativeElement.parentElement.children[0].children[0].innerText = event.checked
      ? "ACTIVE"
      : "INACTIVE";
  }


  /**
   *  the following method is used to update the success response
   * @param {string} message
   * @param {string} redirectUrl
   */
  protected isSuccessful(message?: string, redirectUrl?: string, redirectionTime?: number): void {
    this.FAILED_STATUS = false;
    this.SUCCESS_STATUS = true;
    this.ERROR_MSG = [];
    this.isFormSubmitted = false;
    // if message given show the success bar
    if (message) {
      this.snackBar.open(message, null, {
        duration: this.constantList.DEFAULT_SNACKBAR_DURATION,
        verticalPosition: "bottom"
      });
    }

    // if redirection URL given
    if (redirectUrl) {
      this.goTo(redirectUrl, redirectionTime ? redirectionTime : this.constantList.DEFAULT_REDIRECTION_WAIT_TIME);
    }
  }

  /**
   * The following method is used to update the failure response
   * @param {any[]} errorMessage
   */
  protected isFailure(errorMessage: string[]): void {
    this.FAILED_STATUS = true;
    this.SUCCESS_STATUS = false;
    this.ERROR_MSG = errorMessage;
    this.isFormSubmitted = false;
    this.snackBar.open(Array.isArray(this.ERROR_MSG) ? this.ERROR_MSG[0] : this.ERROR_MSG, this.constantList.DEFAULT_SNACKBAR_LABEL, {
      duration: this.constantList.DEFAULT_SNACKBAR_DURATION,
      verticalPosition: "bottom"
    });
  }

  cancel() {
    this.location.back();
  }

  canAccessModule(moduleName: string) {
    if (!this.permissionService.canAccessModule(moduleName)) {
      this.redirectToLandingPageByRole(this.userService.roles[0].roles[0].slug);
    }
  }

  redirectToLandingPageByRole(roleName: string | undefined) {
    if (roleName) {
      switch (roleName) {
        case "support team":
          this.router.navigate([this.routeList.MACHINE_MAINTENANCE_HOME]);
          break;

        default:
          this.router.navigate([this.routeList.DASHBOARD_HOME]);
          break;
      }
    }
  }

  getChunkArray(array: any[], chunkSize: number = 2): any[] {
    if (!array) {
      return array;
    }

    const chunkedMaps = []
    const tmpArray = Array.from(array);
    for (var i = 0; i < array.length; i += chunkSize) {
      const chunked = tmpArray.slice(i, i + chunkSize)
      chunkedMaps.push(chunked);
    }

    return chunkedMaps;
  }
}
