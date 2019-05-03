import { Injectable, Injector } from "@angular/core";
import { throwError } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs/Observable";
import { HttpResponse } from "@angular/common/http";
import { BaseNetworkService } from "../../../../helpers/services/base-network.service";

@Injectable()
export class CustomerService extends BaseNetworkService {
  
  constructor(injector: Injector) {
    super(injector);
  }

   /**
   * the following gets customer details by business ref id.
   */
  updateCustomerStatus(id: string | number, custStatus: number) {
    return this.http
      .post(`${this.apiList.UPDATE_CUSTOMER_STATUS}`,
      { business_reference_id: id, status: custStatus })
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

   /**
   * the following gets customer details by business ref id.
   */
  getCustomerDetail(id: number | string) {
    return this.http
      .post(`${this.apiList.GET_CUSTOMER_BY_ID}`,
      { business_reference_id: id })
      .pipe(
        map((response: HttpResponse<{ response: string, status: string, data: any }>) => {
          if (<any>response.status === this.constantList.SUCCESS_STATUS) {
            return response["data"];
          } else {
            this.handleErrorMessages(response);
            return null;
          }
        })
      ).catch((e: any) => throwError(this.handleErrorMessages(e.error)));
  }

  /**
   * the following gets the full list of customers.
   */
  getAllCustomers() {
    return this.http
      .post(`${this.apiList.GET_ALL_CUSTOMERS}`,
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
   * the following used to update customer info.
   */
  updateCustomer(formData: FormData): any {
    return this.http
      .post(`${this.apiList.UPDATE_CUSTOMER}`, formData,
        { headers: this.formDataHeaders })
      .pipe(
        map((response: HttpResponse<{ response: string, status: string, data: Object }>) => {
          if (<any>response.status === this.constantList.SUCCESS_STATUS) {
            return response;
          } else {
            this.handleErrorMessages(response);
            return null;
          }
        })
      ).catch((e: any) => throwError(this.handleErrorMessages(e.error)));
  }

  /**
   * the following export the customer
   */
  exportCustomer() {
    return this.http
      .post(`${this.apiList.EXPORT_CUSTOMER}`,
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
