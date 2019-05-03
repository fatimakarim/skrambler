import {Component} from "@angular/core";
import {SkramblerSplashScreenService, SkramblerTranslationLoaderService} from "./theme-core/services";
import {TranslateService} from "@ngx-translate/core";

import {SkramblerNavigationService} from "./theme-core/components/navigation/navigation.service";
import {SkramblerNavigationModel} from "./navigation/navigation.model";
import {locale as navigationEnglish} from "./navigation/i18n/en";
import {PermissionService} from "./helpers/services/permission.service";
import {Router} from "@angular/router";

@Component({
    selector: "skrambler-root",
    template: "<router-outlet></router-outlet>"
})
export class AppComponent {
  constructor(private gpulseNavigationService: SkramblerNavigationService,
              private gpulseSplashScreen: SkramblerSplashScreenService,
              private translate: TranslateService,
              private translationLoader: SkramblerTranslationLoaderService,
              private permissionService: PermissionService,
              private router: Router) {
      // Add languages
      this.translate.addLangs(["en"]);

      // Set the default language
      this.translate.setDefaultLang("en");

      // Use a language
      this.translate.use("en");

      // Set the navigation model
      if (!this.gpulseNavigationService.isNavigationModelAlreadySet()) {
        this.gpulseNavigationService.setNavigationModel(new SkramblerNavigationModel(permissionService));
      }

      // Set the navigation translations
      this.translationLoader.loadTranslations(navigationEnglish);
  }
}
