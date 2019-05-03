import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";

import {SkramblerLoginComponent} from "./login.component";
import {SharedModule} from "../../theme-core/modules/shared.module";

const routes = [
  {
    path: "auth/login",
    component: SkramblerLoginComponent
  },
  {
    path: "reset/:email",
    component: SkramblerLoginComponent
  }
];

@NgModule({
  declarations: [
    SkramblerLoginComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})

export class LoginModule {

}
