import { Injectable, Injector } from "@angular/core";
import {Observable, throwError} from "rxjs";
import { map } from "rxjs/operators";
import { HttpResponse } from "@angular/common/http";
import { BaseNetworkService } from "../../../../helpers/services/base-network.service";
import {reject} from "q";

@Injectable()
export class RedeemedOfferService extends BaseNetworkService {
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * the following gets the full list of parent categories
   */
  getRedeemedOffers() {
    return this.http
      .post(`${this.apiList.GET_REDEMMED_OFFERS}`,
        { headers: this.headers })
      .pipe(
        map((response: HttpResponse<{ response: string, status: string, data: any }>) => {
          if (<any>response.status === this.constantList.SUCCESS_STATUS) {
            return response["data"]["items"];
          } else {
            this.handleErrorMessages(response);
            return null;
          }
        })
      ).catch((e: any) => throwError(this.handleErrorMessages(e.error)));
  }

  /**
   * the following export the redeemed offer
   */
  exportRedeemedOffers() {
    return this.http
      .post(`${this.apiList.EXPORT_REDEMMED_OFFERS}`,
        { headers: this.headers })
      .pipe(
        map((response: HttpResponse<{ response: string, status: string, data: any }>) => {
          if (<any>response.status === this.constantList.SUCCESS_STATUS) {
            return response;
          } else {
            this.handleErrorMessages(response);
            return null;
          }
        })
      ).catch((e: any) => throwError(this.handleErrorMessages(e.error)));
  }

}
