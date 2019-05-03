import { BaseModel } from "./BaseModel";
import { Brand } from "../../layout/content/brands/models/Brand";

export class User extends BaseModel {
  public username: string;
  public name: string;
  public email: string;
  public access_token: string;
  public password: string;
  public phone: string;
  public country_code: number | string;
  public remember_me: boolean | number | string;
  public role?: UserRole;
  public roles?: Role;
  public profile: Profile;
  public permissions: any[];
  public first_name: string;
  public last_name: string;
  public brand: Brand;
  public status: number;

  constructor(values: Object = {}) {
    super();
    Object.assign(this, values);
    this.brand = new Brand();
  }
}

export interface Role {
  id: number;
  slug: string;
}

export interface UserRole {
  id: number;
  user_id: number;
  role_id: number;
  roles: Role[];
}

export interface Profile {
  id: number;
  user_id: number;
  first_name: string | null;
  last_name: string | null;
  phone?: string | null;
  image?: string | null;
  gender?: string | null;
  dob?: string | null;
  country_id?: string | null;
  description?: string | null;
  country?: any;
}
