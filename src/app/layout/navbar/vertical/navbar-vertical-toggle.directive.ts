import { Directive, HostListener, Input } from '@angular/core';
import { SkramblerNavbarVerticalService } from './navbar-vertical.service';
import { SkramblerNavbarVerticalComponent } from './navbar-vertical.component';

@Directive({
    selector: '[skramblerNavbarVertical]'
})
export class SkramblerNavbarVerticalToggleDirective
{
    @Input() skramblerNavbarVertical: string;
    navbar: SkramblerNavbarVerticalComponent;

    constructor(private navbarService: SkramblerNavbarVerticalService)
    {
    }

    @HostListener('click')
    onClick()
    {
        this.navbar = this.navbarService.getNavBar();

        if ( !this.navbar[this.skramblerNavbarVertical] )
        {
            return;
        }

        this.navbar[this.skramblerNavbarVertical]();
    }
}
