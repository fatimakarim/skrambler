import { SkramblerNavigationModelInterface } from "../theme-core/components/navigation/navigation.model";
import * as ROUTE_LIST from "../helpers/constants/routes-list";
import { PermissionService } from "../helpers/services/permission.service";
import { AfterViewChecked } from "@angular/core";

export class SkramblerNavigationModel implements SkramblerNavigationModelInterface, AfterViewChecked {
    public model: any[];
    protected permissionService: PermissionService;

    constructor(permissionService: PermissionService) {
        this.permissionService = permissionService;
        this.initSideNavigationModel();
    }

    /**
     * the following method is used to init the navigation model as per current state
     */
    initSideNavigationModel() {
        this.model = [
            {
                "id": "dashboard",
                "title": "DASHBOARD",
                "type": "item",
                "icon": "home",
                "translate": "NAV.DASHBOARD_TITLE",
                "url": "/" + ROUTE_LIST.DASHBOARD_HOME,
                "isAllow": this.permissionService.canAccessModule("dashboard"),
            },
            {
                "id": "brands",
                "title": "BRANDS",
                "type": "item",
                "translate": "NAV.BRAND_TITLE",
                "url": "/" + ROUTE_LIST.BRAND_LISTING,
                "isAllow": this.permissionService.canAccessModule("brands")
            },
            {
                "id": "featured_campaigns",
                "title": "FEATURED CAMPAIGNS",
                "type": "item",
                "translate": "NAV.FEATURED_CAMPAIGN_TITLE",
                "url": "/" + ROUTE_LIST.Featured_CAMPAIGNS_HOME,
                "isAllow": this.permissionService.canAccessModule("featured_campaigns")
            },
            {
                "id": "vouchers",
                "title": "REDEEMED OFFERS",
                "type": "item",
                "translate": "NAV.VOUCHERS_TITLE",
                "url": "/" + ROUTE_LIST.REDEEMED_OFFERS,
                "isAllow": this.permissionService.canAccessModule("vouchers")
            },
        ];

      if (!this.permissionService.isNotAdmin() && this.permissionService.isSuperAdmin()){
        this.model.splice(4, 0, {
          "id": "customers",
          "title": "CUSTOMERS",
          "type": "item",
          "translate": "NAV.CUSTOMERS_TITLE",
          "url": "/" + ROUTE_LIST.CUSTOMER_HOME,
          "isAllow": this.permissionService.canAccessModule("customers")
        });
      }


        if (this.permissionService.isAdmin()){
            this.model.splice(1, 0, {
                "id": "categories",
                "title": "CATEGORIES",
                "type": "item",
                "translate": "NAV.CATEGORY_TITLE",
                "url": "/" + ROUTE_LIST.CATEGORY_LISTING,
                "isAllow": this.permissionService.canAccessModule("categories"),
            });

            this.model.splice(6, 0, {
                "id": "users",
                "title": "USER MANAGEMENT",
                "type": "item",
                "translate": "NAV.USER_TITLE",
                "url": "/" + ROUTE_LIST.USER_LISTING,
                "isAllow": this.permissionService.canAccessModule("users")
            });
          }
    }

    ngAfterViewChecked() {
        this.model = [];
        this.initSideNavigationModel();
       
    }
    
}
