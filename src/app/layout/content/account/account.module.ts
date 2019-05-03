import {NgModule} from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {SharedModule} from "../../../theme-core/modules/shared.module";
import {ProfileResetPasswordFormComponent} from "./change-password/components/change-password.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "reset-password",
        component: ProfileResetPasswordFormComponent,
      }, {
        path: "**",
        redirectTo: "**",
      }
    ]
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild( routes ),
  ],
  declarations: [
    ProfileResetPasswordFormComponent
  ],
})

export class AccountModule {
}
