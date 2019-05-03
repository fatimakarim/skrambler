import {Injectable} from "@angular/core";
import {UserService} from "./user.service";
import * as CONSTANT_LIST from "../constants/constant-list";
import { SessionStorageService } from "./session-storage.service";
import { LocalStorageService } from "./local-storage.service";

@Injectable()
export class PermissionService {

    private userService;
    private constantList = CONSTANT_LIST;
    private permissions: Object = {};
    private roles: any = {};
  
    constructor(userService: UserService,
      private sessionService: SessionStorageService, private localStorageService: LocalStorageService) {
      this.userService = userService;
      this.permissions = this.sessionService.get("permissions") ?  this.sessionService.getDataInSessionStorage("permissions") :this.localStorageService.getDataInLocalStorage("permissions");
      this.roles =  this.sessionService.get("roles") ?  this.sessionService.getDataInSessionStorage("roles") :this.localStorageService.getDataInLocalStorage("roles");
    }
  
    private validRole(): boolean {
      if (!this.roles) {
        return false;
      }
  
      const role = this.roles;
  
      const slug: string | null = role.slug;
      const index: number = this.constantList.ROLES.map((role: any) => {
        return role.slug;
      }).indexOf(slug);
  
      return index !== -1;
    }
  
    checkModulePermission(moduleName: string, permission: string = this.constantList.PERMISSION_READ): boolean {
      if (!this.permissions || !moduleName) {
        return false;
      }
  
      const perm = this.permissions[moduleName];
      if (!perm) {
        return false;
      }
  
      return perm.indexOf(permission) !== -1;
    }
  
    canAccessModule(moduleName: string, permission: string = this.constantList.PERMISSION_READ): boolean {
      return this.checkModulePermission(moduleName, permission);
    }
  
    public isAdmin(): boolean {
      // if (!this.validRole()) {
      //   return false;
      // }
      this.roles =  this.sessionService.get("roles") ?  this.sessionService.getDataInSessionStorage("roles") :this.localStorageService.getDataInLocalStorage("roles");
      if (this.roles == null){
        return false;
      }

      return this.roles.slug ===  "admin" || this.roles.slug ===  "super-admin";
    }


  public isNotAdmin(): boolean {
    this.roles =  this.sessionService.get("roles") ?  this.sessionService.getDataInSessionStorage("roles") :this.localStorageService.getDataInLocalStorage("roles");
    if (this.roles == null){
      return false;
    }

    return this.roles.slug ===  "admin" ;
  }

  public isSuperAdmin(): boolean {
    this.roles =  this.sessionService.get("roles") ?  this.sessionService.getDataInSessionStorage("roles") :this.localStorageService.getDataInLocalStorage("roles");
    if (this.roles == null){
      return false;
    }

    return this.roles.slug ===  "super-admin" ;
  }
    /**
   * The following checks if user role is brand owner or not.
   * @returns {boolean}
   */
  public IsBrandOwner(Id: number) {
    return Id === this.constantList.SKRAMBLER_BRAND_OWNER_ROLE_ID;

  }

}
