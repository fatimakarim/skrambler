import { Injectable, Injector } from "@angular/core";
import { throwError } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs/Observable";
import { HttpResponse } from "@angular/common/http";

import { BaseNetworkService } from "../../../../helpers/services/base-network.service";

@Injectable()
export class UserService extends BaseNetworkService {
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * the following gets the full list users
   */
  getAllUsers() {
    return this.http
      .post(`${this.apiList.GET_USERS}`,
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
   * the following method is used to add the respective category
   * @param formData 
   * @param id 
   */
  addUser(formData: FormData, id?: number | string) {
    const url: string = id ? `${this.apiList.EDIT_USER}` : this.apiList.ADD_USER;
    return this.http
      .post(url, formData,
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
   * the following method is used to add the respective category
   * @param formData 
   * @param id 
   */
  deleteUser(id: number | string) {
    return this.http
      .post(`${this.apiList.DELETE_USER}`,
      { business_reference_id: id })
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
  getUserById(id: number | string) {
    return this.http
      .post(`${this.apiList.GET_USER}`,
      { user_business_reference_id: id })
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


}
