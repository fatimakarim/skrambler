import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import {MaterialModule} from "./material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import { AngularCropperjsModule } from "angular-cropperjs";

import {SkramblerMatSidenavHelperDirective, SkramblerMatSidenavTogglerDirective} from "../directives/skrambler-mat-sidenav-helper/skrambler-mat-sidenav-helper.directive";
import {SkramblerMatSidenavHelperService} from "../directives/skrambler-mat-sidenav-helper/skrambler-mat-sidenav-helper.service";
import {SkramblerPipesModule} from "../pipes/pipes.module";
import {SkramblerConfirmDialogComponent} from "../components/confirm-dialog/confirm-dialog.component";
import {SkramblerNavbarVerticalService} from "../../layout/navbar/vertical/navbar-vertical.service";
import {SkramblerPerfectScrollbarDirective} from "../directives/skrambler-perfect-scrollbar/skrambler-perfect-scrollbar.directive";
import {SkramblerIfOnDomDirective} from "../directives/skrambler-if-on-dom/skrambler-if-on-dom.directive";
import {SkramblerTableFiltersComponent} from "../components/table/filters/filters.component";
import {CookieService} from "ngx-cookie-service";
import {TranslateModule} from "@ngx-translate/core";

import { SkramblerTableComponent } from "../components/table/table.component";
import {
    SkramblerTranslationLoaderService, SkramblerMatchMedia, DataService, ResourceService
} from "../services";

import {CountrySearchComponent} from "../../helpers/components/country-search/country-search.component";
import {CountrySearchDialogComponent} from "../../helpers/components/country-search/country-search-dialog.component";
import {SearchComponent} from "../../helpers/components/search/search.component";
import {SearchDialogComponent} from "../../helpers/components/search/search-dialog.component";
import {ImageCropDialogComponent} from "../../helpers/components/image-cropper/image-crop-dialog.component";
import { LocalStorageService } from "app/helpers/services/local-storage.service";
import { SessionStorageService } from "app/helpers/services/session-storage.service";
import { SkramblerHeaderComponent } from "../components/header/header.component";
import { RouterModule } from "@angular/router";
import { BrandSearchComponent } from "app/helpers/components/brand-search/brand-search.component";
import { OffersListComponent } from "app/layout/content/offers/components/offers-list.component";
@NgModule({
  declarations: [
    SkramblerMatSidenavHelperDirective,
    SkramblerMatSidenavTogglerDirective,
    SkramblerConfirmDialogComponent,
    SkramblerIfOnDomDirective,
    SkramblerPerfectScrollbarDirective,
    CountrySearchComponent,
    CountrySearchDialogComponent,
    SearchComponent,
    SearchDialogComponent,
    SkramblerTableComponent,
    ImageCropDialogComponent,
    SkramblerHeaderComponent,
    BrandSearchComponent,
    OffersListComponent,
    SkramblerTableFiltersComponent
  ],
  imports: [
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    CommonModule,
    FormsModule,
    SkramblerPipesModule,
    ReactiveFormsModule,
    AngularCropperjsModule,
    TranslateModule,
  ],
  exports: [
    FlexLayoutModule,
    MaterialModule,
    CommonModule,
    FormsModule,
    SkramblerMatSidenavHelperDirective,
    SkramblerMatSidenavTogglerDirective,
    SkramblerPipesModule,
    SkramblerPerfectScrollbarDirective,
    ReactiveFormsModule,
    SkramblerIfOnDomDirective,
    TranslateModule,
    CountrySearchComponent,
    CountrySearchDialogComponent,
    SearchComponent,
    SearchDialogComponent,
    SkramblerTableComponent,
    ImageCropDialogComponent,
    SkramblerHeaderComponent,
    BrandSearchComponent,
    OffersListComponent,
    SkramblerTableFiltersComponent
  ],
  entryComponents: [
    SkramblerConfirmDialogComponent,
    CountrySearchComponent,
    CountrySearchDialogComponent,
    SearchComponent,
    SearchDialogComponent,
    ImageCropDialogComponent,
    SkramblerHeaderComponent,
    BrandSearchComponent,
    OffersListComponent,
    SkramblerTableFiltersComponent
  ],
  providers: [
    CookieService,
    SkramblerMatchMedia,
    SkramblerNavbarVerticalService,
    SkramblerMatSidenavHelperService,
    SkramblerTranslationLoaderService,
    DataService,
    ResourceService,
    LocalStorageService,
    SessionStorageService,
  ]
})

export class SharedModule {

}
