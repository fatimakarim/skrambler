import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { SkramblerMainComponent } from '../../layout.component';

@Component({
    selector     : 'skrambler-navbar-horizontal',
    templateUrl  : './navbar-horizontal.component.html',
    styleUrls    : ['./navbar-horizontal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SkramblerNavbarHorizontalComponent implements OnInit, OnDestroy
{
    constructor(private skramblerMainComponent: SkramblerMainComponent)
    {
    }

    ngOnInit()
    {
        this.skramblerMainComponent.addClass('skrambler-nav-bar-horizontal');
    }

    ngOnDestroy()
    {
        this.skramblerMainComponent.removeClass('skrambler-nav-bar-horizontal');
    }
}
