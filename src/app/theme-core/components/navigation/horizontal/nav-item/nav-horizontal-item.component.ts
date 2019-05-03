import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector   : 'skrambler-nav-horizontal-item',
    templateUrl: './nav-horizontal-item.component.html',
    styleUrls  : ['./nav-horizontal-item.component.scss']
})
export class SkramblerNavHorizontalItemComponent
{
    @HostBinding('class') classes = 'nav-item';
    @Input() item: any;
}
