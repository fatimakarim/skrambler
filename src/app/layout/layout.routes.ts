import { RouterModule, Routes } from "@angular/router";
import { SkramblerMainComponent } from "./layout.component";
import { CanActivateGuard } from "../helpers/services/can-activate.guard";
import * as ROUTE_LIST from "../helpers/constants/routes-list";

// noinspection TypeScriptValidateTypes
const protectedRoutes: Routes = [
  {
    path: "", component: SkramblerMainComponent, children: [
      { path: "dashboard", loadChildren: "./content/dashboard/skrambler-dashboard.module#SkramblerDashboardModule" },
      {
        path: ROUTE_LIST.CATEGORY_LISTING, loadChildren: "./content/categories/categories.module#CategoriesModule"
      },
      {
        path: ROUTE_LIST.BRAND_LISTING, loadChildren: "./content/brands/brands.module#BrandsModule"
      },
      {
        path: ROUTE_LIST.BRANCHES_LISTING, loadChildren: "./content/branches/branches.module#BranchesModule"
      },
      {
        path: ROUTE_LIST.OFFERS_LISTING, loadChildren: "./content/offers/offers.module#OffersModule"
      }
      ,
      {
        path: ROUTE_LIST.CUSTOMER_HOME, loadChildren: "./content/customers/customers.module#CustomersModule"
      },
      {
        path: ROUTE_LIST.REDEEMED_OFFERS, loadChildren: "./content/redeemed-offers/redeemed-offers.module#RedeemedOffersModule"
      },
      {
        path: ROUTE_LIST.USER_LISTING, loadChildren: "./content/users/users.module#UsersModule"
      },
      {
        path: ROUTE_LIST.CAMPSIGNS_LISTING, loadChildren: "./content/featured-campaigns/featured-campaigns.module#FeaturedCampaignsModule"
      }
      ,
      {
        path: ROUTE_LIST.DASHBOARD_HOME, loadChildren: "./content/dashboard/skrambler-dashboard.module#SkramblerDashboardModule"
      },
      {path: ROUTE_LIST.ACCOUNT_HOME, loadChildren: "./content/account/account.module#AccountModule"}

    ], canActivate: [CanActivateGuard]
  },
];
export const ROUTES = RouterModule.forChild(protectedRoutes);
