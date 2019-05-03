import { BaseModel } from "../../../../helpers/models/BaseModel";
import { Brand } from "../../brands/models/Brand";
export class Offer extends BaseModel {

  public brand: Brand;
  public about: string;
  active: number | boolean;
  approved: number | boolean;
  public description: string;
  public reactivation_days: number | string;
  public fees: number | string;
  public estimated_savings: number | string;
  public points_earned: number | string;
  public search_weight: number | string;
  public begin_date: string;
  public end_date: string;
  public max_allowed_offers: number;
  public max_allowed_offers_per_user: number;
  public no_offers: number;
  public surprise_offer_days: any [] = [];
  public offer_delivery_types: any [] = [];
  public type: {
    id: string | number,
    name: string
  };
  /**
   * the following is used to map the key to the respective UI control on the page
   */
  public offer_type_id: number;
  public kind_id: number;

  /**
   * the following is used to map the response to the respective interface for Reactiveforms
   */
  public branch_offers: Brand[];
  constructor(values: Object = {}) {
    super();
    this.brand = new Brand();
    if (values) {
      Object.assign(this, values);
    }
  }
}
