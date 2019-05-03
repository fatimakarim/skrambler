import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BranchesListComponent } from "./components/branches-list.component";
import { BranchFormComponent } from "./components/branch-form.component";
import { BranchResolverService } from "./services/branch-resolver.service";
import { SharedModule } from "app/theme-core/modules/shared.module";
import { BranchService } from "./services/branch.service";
import { BrandService } from "../brands/services/brand.service";
import { AgmCoreModule } from "@agm/core";
import { CommonModule } from "@angular/common";
import { BrandResolverService } from "../brands/services/brand-resolver.service";
import { CategoryService } from "../categories/services/category.service";


const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "create/:id",
        component: BranchFormComponent,
        resolve : {
          brand: BrandResolverService
        }
      },
      {
        path: ":id",
        component: BranchFormComponent,
        resolve: {
          branch: BranchResolverService
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
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAjvUDKCZDiOh5dgCVpCOGIp9yvzSGf6P4",
      libraries: ["places"]
    })
  ],
  declarations: [
    BranchFormComponent
  ],
  providers: [
    BranchService, BranchResolverService, BrandService, BrandResolverService, CategoryService
  ]
})
export class BranchesModule {
}
