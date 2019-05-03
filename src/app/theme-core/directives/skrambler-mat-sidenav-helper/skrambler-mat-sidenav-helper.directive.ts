import { Directive, Input, OnInit, HostListener, OnDestroy, HostBinding } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ObservableMedia } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { SkramblerMatchMedia } from '../../services/match-media.service';
import { SkramblerMatSidenavHelperService } from './skrambler-mat-sidenav-helper.service';

@Directive({
    selector: '[skramblerMatSidenavHelper]'
})
export class SkramblerMatSidenavHelperDirective implements OnInit, OnDestroy
{
    matchMediaSubscription: Subscription;

    @HostBinding('class.mat-is-locked-open') isLockedOpen = true;

    @Input('skramblerMatSidenavHelper') id: string;
    @Input('mat-is-locked-open') matIsLockedOpenBreakpoint: string;

    constructor(
        private skramblerMatSidenavService: SkramblerMatSidenavHelperService,
        private skramblerMatchMedia: SkramblerMatchMedia,
        private observableMedia: ObservableMedia,
        private matSidenav: MatSidenav
    )
    {
    }

    ngOnInit()
    {
        this.skramblerMatSidenavService.setSidenav(this.id, this.matSidenav);

        if ( this.observableMedia.isActive(this.matIsLockedOpenBreakpoint) )
        {
            this.isLockedOpen = true;
            this.matSidenav.mode = 'side';
            this.matSidenav.toggle(true);
        }
        else
        {
            this.isLockedOpen = false;
            this.matSidenav.mode = 'over';
            this.matSidenav.toggle(false);
        }

        this.matchMediaSubscription = this.skramblerMatchMedia.onMediaChange.subscribe(() => {
            if ( this.observableMedia.isActive(this.matIsLockedOpenBreakpoint) )
            {
                this.isLockedOpen = true;
                this.matSidenav.mode = 'side';
                this.matSidenav.toggle(true);
            }
            else
            {
                this.isLockedOpen = false;
                this.matSidenav.mode = 'over';
                this.matSidenav.toggle(false);
            }
        });
    }

    ngOnDestroy()
    {
        this.matchMediaSubscription.unsubscribe();
    }
}

@Directive({
    selector: '[skramblerMatSidenavToggler]'
})
export class SkramblerMatSidenavTogglerDirective
{
    @Input('skramblerMatSidenavToggler') id;

    constructor(private skramblerMatSidenavService: SkramblerMatSidenavHelperService)
    {
    }

    @HostListener('click')
    onClick()
    {
        this.skramblerMatSidenavService.getSidenav(this.id).toggle();
    }
}
