import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";

import {SkramblerRegisterComponent} from "./register.component";
import {SharedModule} from "../../theme-core/modules/shared.module";

const routes = [
  {
    path: "auth/register",
    component: SkramblerRegisterComponent
  }
];

@NgModule({
  declarations: [
    SkramblerRegisterComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})

export class RegisterModule {

}
