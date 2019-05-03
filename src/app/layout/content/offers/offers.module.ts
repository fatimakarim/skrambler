import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OfferFormComponent } from "./components/offer-form.component";
import { OfferResolverService } from "./services/offer-resolver.service";
import { OfferViewComponent } from "./components/offer-view.component";
import { SharedModule } from "app/theme-core/modules/shared.module";
import { OfferService } from "./services/offer.service";
import { BrandService } from "../brands/services/brand.service";
import { BrandResolverService } from "../brands/services/brand-resolver.service";
import { CategoryService } from "../categories/services/category.service";


const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "create/:id",
        component: OfferFormComponent,
        resolve : {
          brand: BrandResolverService
        }
      }, 
      {
        path: ":id",
        component: OfferFormComponent,
        resolve: {
          offer : OfferResolverService
        }
      }, 
      {
        path: "view/:id",
        component: OfferViewComponent,
        resolve: {
          offer : OfferResolverService
        }
      }, 
      {
        path: "**",
        redirectTo: "",
      }
    ]
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    OfferFormComponent, OfferViewComponent
  ],
  providers: [
    OfferService, OfferResolverService, BrandService, BrandResolverService, CategoryService
  ]
})
export class OffersModule {
}
