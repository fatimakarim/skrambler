import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";

import {SkramblerError404Component} from "./error-404.component";
import {SharedModule} from "../../theme-core/modules/shared.module";

const routes = [
  {
    path: "errors/error-404",
    component: SkramblerError404Component
  }
];

@NgModule({
  declarations: [
    SkramblerError404Component
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})

export class Error404Module {

}
