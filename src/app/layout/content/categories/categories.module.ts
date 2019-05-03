import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CategoryService } from "./services/category.service";
import { CategoryResolverService } from "./services/category-resolver.service";
import { SharedModule } from "../../../theme-core/modules/shared.module";
import { CategoryFormComponent } from "./components/category-form.component";
import { CategoriesListComponent } from "./components/categories-list.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: CategoriesListComponent,
        resolve: {
          categories: CategoryResolverService
        }
      }, {
        path: "create",
        component: CategoryFormComponent,
        resolve: {
          data: CategoryResolverService
        }
      }, {
        path: ":id",
        component: CategoryFormComponent,
        resolve: {
          data: CategoryResolverService
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
    CategoriesListComponent, CategoryFormComponent
  ],
  providers: [
    CategoryService, CategoryResolverService
  ]
})
export class CategoriesModule {
}
