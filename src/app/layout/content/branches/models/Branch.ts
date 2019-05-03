import { BaseModel } from "../../../../helpers/models/BaseModel";
import { Category } from "../../categories/models/Category";
import { Offer } from "../../offers/models/Offer";
import { Brand } from "../../brands/models/Brand";
export class Branch extends BaseModel {
  public brand: Brand;
  public name: string;
  public description: string;
  public location_name: string;
  public longitude: number | string;
  public latitude: number | string;
  public branch_offer: Offer;
  public review: number | string;
  /**
   * the following keeps the timings structure based on the incoming data from the respective API
   */
  public timings: Timing[];

  /**
   * the following list of branch timings are for direct mapping from API to the ReactiveForm
   */
  private branch_timings_mon_start_time: string;
  private branch_timings_mon_end_time: string;
  private branch_timings_mon_status = 0;
  private branch_timings_tues_start_time: string;
  private branch_timings_tues_end_time: string;
  private branch_timings_tues_status = 0;
  private branch_timings_wed_start_time: string;
  private branch_timings_wed_end_time: string;
  private branch_timings_wed_status = 0;
  private branch_timings_thurs_start_time: string;
  private branch_timings_thurs_end_time: string;
  private branch_timings_thurs_status = 0;
  private branch_timings_frid_start_time: string;
  private branch_timings_frid_end_time: string;
  private branch_timings_frid_status = 0;
  private branch_timings_sat_start_time: string;
  private branch_timings_sat_end_time: string;
  private branch_timings_sat_status = 0;
  private branch_timings_sun_start_time: string;
  private branch_timings_sun_end_time: string;
  private branch_timings_sun_status = 0;
  /**
   * constructure
   * @param values 
   */
  constructor(values: Object = {}) {
    super();
    this.brand = new Brand();
  }

  /**
   * the following method is used to update the timings and respective statuses
   */
  public setupBranchTimeDetails(){
    this.branch_timings_mon_start_time = this.timings[0].open_time;
    this.branch_timings_mon_end_time = this.timings[0].close_time;
    this.branch_timings_mon_status = this.timings[0].active;

    this.branch_timings_tues_start_time = this.timings[1].open_time;
    this.branch_timings_tues_end_time = this.timings[1].close_time;
    this.branch_timings_tues_status = this.timings[1].active;

    this.branch_timings_wed_start_time = this.timings[2].open_time;
    this.branch_timings_wed_end_time = this.timings[2].close_time;
    this.branch_timings_wed_status = this.timings[2].active;

    this.branch_timings_thurs_start_time = this.timings[3].open_time;
    this.branch_timings_thurs_end_time = this.timings[3].close_time;
    this.branch_timings_thurs_status = this.timings[3].active;

    this.branch_timings_frid_start_time = this.timings[4].open_time;
    this.branch_timings_frid_end_time = this.timings[4].close_time;
    this.branch_timings_frid_status = this.timings[4].active;

    this.branch_timings_sat_start_time = this.timings[5].open_time;
    this.branch_timings_sat_end_time = this.timings[5].close_time;
    this.branch_timings_sat_status = this.timings[5].active;

    this.branch_timings_sun_start_time = this.timings[6].open_time;
    this.branch_timings_sun_end_time = this.timings[6].close_time;
    this.branch_timings_sun_status = this.timings[6].active;
  }

  /**
   * the following is used to reset the branch timings
   */
  public resetTimings() {
    this.branch_timings_mon_start_time = null;
    this.branch_timings_mon_end_time = null;
    this.branch_timings_tues_start_time = null;
    this.branch_timings_tues_end_time = null;
    this.branch_timings_wed_start_time = null;
    this.branch_timings_wed_end_time = null;
    this.branch_timings_thurs_start_time = null;
    this.branch_timings_thurs_end_time = null;
    this.branch_timings_frid_start_time = null;
    this.branch_timings_frid_end_time = null;
    this.branch_timings_sat_start_time = null;
    this.branch_timings_sat_end_time = null;
    this.branch_timings_sun_start_time = null;
    this.branch_timings_sun_end_time = null;
  }
}

export class Timing {
  public id: number | string;
  public open_time: string;
  public close_time: string;
  public active: number;
  public day_of_week: number | string;
}
