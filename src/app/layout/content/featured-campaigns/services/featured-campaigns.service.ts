import { Injectable, Injector } from "@angular/core";
import { throwError } from "rxjs";
import { map, tap } from "rxjs/operators";
import { HttpResponse } from "@angular/common/http";
import { BaseNetworkService } from "../../../../helpers/services/base-network.service";

@Injectable({
  providedIn: 'root'
})
export class FeaturedCampaignsService extends BaseNetworkService {

  constructor(injector: Injector) {
    super(injector);
  }

   /**
   * the following method is used to add the respective category
   * @param formData 
   * @param id 
   */
  addCampaign(formData: FormData, id?: number | string) {
    const url: string = id ? `${this.apiList.EDIT_CAMPAIGN}` : this.apiList.ADD_CAMPAIGN;
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
   * the following gets the full list of campsigns.
   */
  getAllCampaigns() {
    return this.http
      .post(`${this.apiList.GET_ALL_CAMPSIGNS}`,
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
   * the following gets the full list of campsigns.
   */
  getCampaignById(id: string | number) {
    return this.http
      .post(`${this.apiList.GET_CAMPSIGNS_ById}`,
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

}
