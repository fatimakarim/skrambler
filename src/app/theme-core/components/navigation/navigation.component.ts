import { Component, Input, OnDestroy, ViewEncapsulation } from "@angular/core";
import { SkramblerNavigationService } from "./navigation.service";
import { Subscription } from "rxjs";

@Component({
    selector     : "skrambler-navigation",
    templateUrl  : "./navigation.component.html",
    styleUrls    : ["./navigation.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class SkramblerNavigationComponent implements OnDestroy
{
    navigationModel: any[];
    navigationModelChangeSubscription: Subscription;

    @Input("layout") layout = "vertical";

    constructor(private gpulseNavigationService: SkramblerNavigationService)
    {
        this.navigationModelChangeSubscription =
            this.gpulseNavigationService.onNavigationModelChange
                .subscribe((navigationModel) => {
                    this.navigationModel = navigationModel;
                });
    }

    ngOnDestroy()
    {
        this.navigationModelChangeSubscription.unsubscribe();
    }

}
