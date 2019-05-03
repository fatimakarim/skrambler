import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RedeemedOfferResolverService } from "./services/redeemed-offer-resolver.service";
import { RedeemedOfferService } from "./services/redeemed-offer.service";
import { SharedModule } from "../../../theme-core/modules/shared.module";
import { RedeemedOfferListComponent } from "./components/redeemed-offer-list.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: RedeemedOfferListComponent,
        resolve: {
          offers: RedeemedOfferResolverService
        }
      }, {
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
    RedeemedOfferListComponent
  ],
  providers: [
    RedeemedOfferService, RedeemedOfferResolverService
  ]
})
export class RedeemedOffersModule {
}
