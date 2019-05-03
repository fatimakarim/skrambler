import { BaseModel } from "../../../../helpers/models/BaseModel";
import { Category } from "../../categories/models/Category";
import { Branch } from "../../branches/models/Branch";
export class Brand extends BaseModel {
  public name: string;
  public description: string;
  public website: string;
  public logo: string;
  public image: string;
  public insta_page: string;
  public twitter_page: string;
  public facebook_page: string;
  public company_id: string;
  public category_id: string;
  public loyal_offers_count: number;
  public surprise_offers_count: number;
  public friends_family_offers_count: number;
  public skrambler_hashtag: string[];
  public category: Category;
  public branches: Branch[];
  public manager =  {};
  public brand_delivery_types: any [] = [];
  /**
   * the following 3 variables are used to hanlde front-end image manipulation
   */
  public mainImageDataURI: any;
  public mainImagePath: any;
  public mainImage: any;

  /**
   * the following 3 variables are used to hanlde front-end logo manipulation
   */
  public logoImageDataURI: any;
  public logoImagePath: any;
  public logoImage: any;

  /**
   * the following 2 variables are used to maintaining images being added and deleted through the API
   */
  private photos: any[] = [];
  private deletedPhotosAlbumId: any[] = [];

  /**
   * the following variables are used to map API response onto respective data for the UI
   */
  private brand_sub_categories: any[] = [];
  private brand_tags: any[] = [];

  constructor(values: Object = {}) {
    super();
    if (values) {
      Object.assign(this, values);
    }
  }
}
