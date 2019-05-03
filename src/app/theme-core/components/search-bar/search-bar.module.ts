import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";

import {SharedModule} from "../../modules/shared.module";
import {SkramblerSearchBarComponent} from "./search-bar.component";

@NgModule({
  declarations: [
    SkramblerSearchBarComponent
  ],
  imports: [
    SharedModule,
    RouterModule
  ],
  exports: [
    SkramblerSearchBarComponent
  ]
})
export class SkramblerSearchBarModule {
}
