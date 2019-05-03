import { BaseModel } from "../../../../helpers/models/BaseModel";
import { Brand } from "../../brands/models/Brand";
export class Campaign extends BaseModel {
  public description: string;
  public max_impressions: number;
  public left_impressions: number;
  public impressions_used: number;
  public impressions_remaining: number;
  public title: string;
  public gender: string;
  public to_age: number;
  public from_age: number;
  public logo: string;
  public start_date: string;
  public end_date: string;
  public brand: Brand;
  /**
   * the following 3 variables are used to hanlde front-end image manipulation
   */
  public mainImageDataURI: any;
  public mainImagePath: any;
  public mainImage: any;

  constructor(values: Object = {}) {
    super();
    if (values) {
      Object.assign(this, values);
    }
    this.brand = new Brand();
  }
}
