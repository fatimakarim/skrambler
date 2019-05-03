import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";

import {SkramblerForgotPasswordComponent} from "./forgot-password.component";
import {SharedModule} from "../../theme-core/modules/shared.module";

const routes = [
  {
    path: "auth/forgot-password",
    component: SkramblerForgotPasswordComponent
  }
];

@NgModule({
  declarations: [
    SkramblerForgotPasswordComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})

export class SkramblerForgotPasswordModule {

}
