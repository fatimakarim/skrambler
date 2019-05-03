import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { FeaturedCampaignsService } from "./services/featured-campaigns.service";
import { FeaturedCampaignsResolverService } from "./services/featured-campaigns-resolver.service";
import { SharedModule } from "../../../theme-core/modules/shared.module";
import { FeaturedCampaignsListComponent } from './components/featured-campaigns-list.component';
import { FeaturedCampaignsFormComponent } from './components/featured-campaigns-form.component';
import { BrandResolverService } from "../brands/services/brand-resolver.service";
import { BrandService } from "../brands/services/brand.service";
import { CategoryService } from "../categories/services/category.service";
import { MatDatepickerModule, MatNativeDateModule, DateAdapter } from '@angular/material';
import { DateFormat } from './models/Date-formate';
import { FeaturedCampaignViewComponent } from './components/featured-campaign-view.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: FeaturedCampaignsListComponent,
        resolve: {
          categories: FeaturedCampaignsResolverService
        }
      }, {
        path: "create",
        component: FeaturedCampaignsFormComponent,
        resolve: {
          brands: BrandResolverService,
        }
      }, {
        path: ":id",
        component: FeaturedCampaignsFormComponent,
        resolve: {
          data: FeaturedCampaignsResolverService
        }
      },
      {
        path: "view/:id",
        component: FeaturedCampaignViewComponent,
        resolve: {
          data: FeaturedCampaignsResolverService
        }
      }
      , {
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
    MatDatepickerModule, MatNativeDateModule
  ],
  declarations: [FeaturedCampaignsListComponent, FeaturedCampaignsFormComponent, FeaturedCampaignViewComponent],
  providers: [
    { provide: DateAdapter, useClass: DateFormat },
    CategoryService, BrandService, BrandResolverService, FeaturedCampaignsService, FeaturedCampaignsResolverService
  ]
})
export class FeaturedCampaignsModule {
  constructor(private dateAdapter:DateAdapter<Date>) {
		dateAdapter.setLocale('en-in'); // DD/MM/YYYY
	}
 }
