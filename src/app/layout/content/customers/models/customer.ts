import { BaseModel } from "../../../../helpers/models/BaseModel";
import { Profile } from "./profile";
import { Devices } from "./devices";

export class Customer extends BaseModel {
  public username: string | null = null;
  public first_name: string | null = null;
  public last_name: string | null = null;
  public user_skrambler_id: string | null = null;
  public profile_picture: string | null = null;
  public description: string | null = null;
  public position: string | null = null;
  public account_rejection_reason: string | null = null;
  public status: number;
  public verified: number;
  public email: string | null = null;
  public promo_code: string | null = null;
  public mobile_number: string | null = null;
  public mobile_code: string | null = null;
  public company_id: string | null = null;
  public points: number;
  public role_id: number;
  public slug: string;
  public account_status_id: number;
  public account_status_name: string;
  public profile: Profile;
  public devices: Devices[];
  public fullName: string;
  public type: string;
  public gender: string;
  public dob: string;
  public school: string;
  public ambassador: string | number;
  public referral_code: string | number;

  public ProfileImageDataURI: string;
  public NationalCardFrontImageDataURI: string;
  public NationalCardBackImageDataURI: string;
  public ProfileImagePath: string;
  public NationalCardFrontImagePath: string;
  public NationalCardBackImagePath: string;
  public ProfileImage: string;
  public NationalCardFrontImage: string;
  public NationalCardBackImage: string;
  
  constructor(values: Object = {}) {
    super();
    if (values) {
      Object.assign(this, values);
    }
    this.profile = new Profile();
  }
}
  
