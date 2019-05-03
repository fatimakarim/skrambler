import { Component, Injector, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { NavigationEnd, NavigationStart } from "@angular/router";
import { SkramblerConfigService } from "../../theme-core/services";
import { SkramblerBaseComponent } from "../../helpers/components/base.component";
import { SkramblerNavigationService } from "../../theme-core/components/navigation/navigation.service";
import { SharedDataService } from "../../helpers/services/shared-data.service";

@Component({
    selector: "skrambler-toolbar",
    templateUrl: "./toolbar.component.html",
    styleUrls: ["./toolbar.component.scss"]
})

export class SkramblerToolbarComponent extends SkramblerBaseComponent implements OnDestroy {
    userStatusOptions: any[];
    horizontalNav: boolean;
    private loaderSubscription: any;
    private gPulseSettingSubscription: any;

    /**
     * the following is used to show the loading bar
     */
    showLoadingBar = false;
    constructor(private gpulseConfig: SkramblerConfigService,
        public navigationService: SkramblerNavigationService,
        public sharedDataService: SharedDataService,
        private ref: ChangeDetectorRef,
        injector: Injector) {
        super(injector);

        this.userStatusOptions = [
            {
                "title": "Online",
                "icon": "icon-checkbox-marked-circle",
                "color": "#4CAF50"
            },
            {
                "title": "Away",
                "icon": "icon-clock",
                "color": "#FFC107"
            },
            {
                "title": "Do not Disturb",
                "icon": "icon-minus-circle",
                "color": "#F44336"
            },
            {
                "title": "Invisible",
                "icon": "icon-checkbox-blank-circle-outline",
                "color": "#BDBDBD"
            },
            {
                "title": "Offline",
                "icon": "icon-checkbox-blank-circle-outline",
                "color": "#616161"
            }
        ];

        this.gPulseSettingSubscription = this.gpulseConfig.onSettingsChanged.subscribe((settings) => {
            this.horizontalNav = settings.layout.navigation === "top";
        });

        /**
         * the following method is used to monitor the status for showing loading bar or not
         */
        this.loaderSubscription = this.sharedDataService.loadingBarStatus.subscribe(status => {
            if (status !== null) {
                setTimeout(() => {
                    this.showLoadingBar = status;
                    this.cd.detectChanges();
                }, 500);
            }
        });
    }

    ngOnDestroy() {
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }

        if (this.gPulseSettingSubscription) {
            this.gPulseSettingSubscription.unsubscribe();
        }
    }

    logoutUser() {
        if (this.userService.isLoggedIn()) {
            this.userService.logout();
            // setting the navigation model to null, so it gets re-evaluated upon next login
            this.navigationService.navigationModel = null;
            this.router.navigateByUrl("auth/login").then();
        }
    }
    /**
     * the following method is used to get the search events
     * @param event
     */
    search(event: any) {
        this.sharedDataService.changeMessage(event);
    }
}
