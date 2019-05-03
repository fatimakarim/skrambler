import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { BrandService } from "./services/brand.service";
import { BrandResolverService } from "./services/brand-resolver.service";
import { SharedModule } from "../../../theme-core/modules/shared.module";
import { BrandFormComponent } from "./components/brand-form.component";
import { BrandsListComponent } from "./components/brands-list.component";
import { TagsResolverService } from "app/helpers/services/tags-resolver.service";
import { CategoryService } from "../categories/services/category.service";
import { CategoryResolverService } from "../categories/services/category-resolver.service";
import { BrandViewComponent } from "./components/brand-view.component";
import { BranchesListComponent } from "../branches/components/branches-list.component";
import { BrandDialogFormComponent} from "./components/brand-dialog-form.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: BrandsListComponent,
        resolve: {
          categories: CategoryResolverService
        }
      },
      {
        path: "create",
        component: BrandFormComponent,
        resolve: {
          categories: CategoryResolverService,
        }
      },
      {
        path: ":id",
        component: BrandFormComponent,
        resolve: {
          tags: TagsResolverService,
          brand: BrandResolverService
        }
      },
      {
        path: "view/:id",
        component: BrandViewComponent,
        resolve: {
          tags: TagsResolverService,
          brand: BrandResolverService
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
  declarations: [BranchesListComponent, BrandsListComponent, BrandFormComponent, BrandViewComponent, BrandDialogFormComponent
  ],
  providers: [
    CategoryService, CategoryResolverService, TagsResolverService, BrandService, BrandResolverService
  ],
  entryComponents: [
    BrandDialogFormComponent
  ]
})
export class BrandsModule {
}
