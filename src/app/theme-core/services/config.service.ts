import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {NavigationStart, Router} from "@angular/router";
import {Platform} from "@angular/cdk/platform";

@Injectable()
export class SkramblerConfigService {
  settings: any;
  defaultSettings: any;
  onSettingsChanged: BehaviorSubject<any>;

  /**
   * @param router
   * @param platform
   */
  constructor(private router: Router,
              public platform: Platform) {
    // Set the default settings
    this.defaultSettings = {
      layout: {
        navigation: "left", // "right", "left", "top", "none"
        navigationFolded: false, // true, false
        toolbar: "below", // "above", "below", "none"
        footer: "below", // "above", "below", "none"
        mode: "fullwidth" // "boxed", "fullwidth"
      },
      colorClasses: {
        toolbar: "skrambler-primary-red-color",
        navbarTop:"skrambler-primary-red-color",
        navbar: "skrambler-primary-white-color",
        footer: "skrambler-primary-white-color"
      },
      customScrollbars: true,
      routerAnimation: "fadeIn" // fadeIn, slideUp, slideDown, slideRight, slideLeft, none
    };

    /**
     * Disable Custom Scrollbars if Browser is Mobile
     */
    if (this.platform.ANDROID || this.platform.IOS) {
      this.defaultSettings.customScrollbars = false;
    }

    // Set the settings from the default settings
    this.settings = Object.assign({}, this.defaultSettings);

    // Reload the default settings on every navigation start
    router.events.subscribe(
      (event) => {
        if (event instanceof NavigationStart) {
          this.setSettings({layout: this.defaultSettings.layout});
        }
      }
    );

    // Create the behavior subject
    this.onSettingsChanged = new BehaviorSubject(this.settings);
  }

  /**
   * Sets settings
   * @param settings
   */
  setSettings(settings) {
    // Set the settings from the given object
    this.settings = Object.assign({}, this.settings, settings);

    // Trigger the event
    this.onSettingsChanged.next(this.settings);
  }
}
