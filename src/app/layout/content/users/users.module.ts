import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UserService } from "./services/user.service";
import { UserResolverService } from "./services/user-resolver.service";
import { SharedModule } from "../../../theme-core/modules/shared.module";
import { UsersListComponent } from "./components/users-list.component";
import { UserFormComponent } from './components/user-form.component';
import { BrandResolverService } from "../brands/services/brand-resolver.service";
import { BrandService } from "../brands/services/brand.service";
import { CategoryService } from "../categories/services/category.service";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: UsersListComponent,
        resolve: {
          users: UserResolverService
        }
      },
      {
        path: "create",
        component: UserFormComponent,
        resolve: {
          brands: BrandResolverService,
        }
      }, {
        path: ":id",
        component: UserFormComponent,
        resolve: {
          data: UserResolverService
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
    UsersListComponent, UsersListComponent, UserFormComponent
  ],
  providers: [
    CategoryService, BrandService, BrandResolverService, UserService, UserResolverService
  ]
})
export class UsersModule {
}
