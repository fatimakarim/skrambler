import { BaseModel } from "../../../../helpers/models/BaseModel";
export class Category extends BaseModel {
  public order = 0;
  public restaurant_id: number | null = null;
  public name: string | null = null;
  public image: string | null = null;
  public image_data?: any = null;
  public category_referral: string | null = null;
  public category_id: string | number;
  public tags: any[];

  constructor(values: Object = {}) {
    super();
    if (values) {
      Object.assign(this, values);
    }
  }
}
