import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../theme-core/modules/shared.module";
import {SkramblerMainComponent} from "./layout.component";
import {SkramblerFooterComponent} from "./footer/footer.component";
import {SkramblerNavbarVerticalComponent} from "./navbar/vertical/navbar-vertical.component";
import {SkramblerToolbarComponent} from "./toolbar/toolbar.component";
import {SkramblerNavigationModule} from "../theme-core/components/navigation/navigation.module";
import {SkramblerNavbarVerticalToggleDirective} from "./navbar/vertical/navbar-vertical-toggle.directive";
import {SkramblerNavbarHorizontalComponent} from "./navbar/horizontal/navbar-horizontal.component";
import {SkramblerQuickPanelComponent} from "./quick-panel/quick-panel.component";
import {SkramblerSearchBarModule} from "../theme-core/components/search-bar/search-bar.module";
import {ROUTES} from "./layout.routes";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { CanActivateGuard } from "../helpers/services/can-activate.guard";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { JwtInterceptor } from "../helpers/interceptors/jwt.interceptor";
import { TimerInterceptor } from "../helpers/interceptors/timer.interceptor";
import { HttpRequestInterceptor } from "../helpers/interceptors/http-request.interceptor";
import { BranchesListComponent } from "./content/branches/components/branches-list.component";


@NgModule({
  declarations: [
    SkramblerFooterComponent,
    SkramblerMainComponent,
    SkramblerNavbarVerticalComponent,
    SkramblerNavbarHorizontalComponent,
    SkramblerToolbarComponent,
    SkramblerNavbarVerticalToggleDirective,
    SkramblerQuickPanelComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    BrowserAnimationsModule,
    SkramblerNavigationModule,
    SkramblerSearchBarModule,
    ROUTES
  ],
  exports: [
    SkramblerMainComponent, SharedModule
  ],
  providers: [
    CanActivateGuard, {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TimerInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    }
  ]
})

export class SkramblerLayoutModule {
}
