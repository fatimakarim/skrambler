import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../../theme-core/modules/shared.module";
import {SkramblerDashboardComponent} from "../../content/dashboard/skrambler-dashboard.component";
import { CategoryResolverService } from "../categories/services/category-resolver.service";
import { CategoryService } from "../categories/services/category.service";
import { BrandService } from "../brands/services/brand.service";
import { BrandResolverService } from "../brands/services/brand-resolver.service";
import { AgmCoreModule } from "@agm/core";

const routes = [
  {
    path: "",
    component: SkramblerDashboardComponent,
    resolve: {
      categories: CategoryResolverService,
      brand: BrandResolverService
    }
  }
];

@NgModule({
  declarations: [
    SkramblerDashboardComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAjvUDKCZDiOh5dgCVpCOGIp9yvzSGf6P4",
      libraries: ["places"]
    })
  ],
  exports: [
    SkramblerDashboardComponent
  ],
  providers: [
    CategoryService, CategoryResolverService, BrandService, BrandResolverService
  ],
})

export class SkramblerDashboardModule {
}
