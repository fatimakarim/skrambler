import { NgModule } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { RouterModule } from '@angular/router';
import { SkramblerNavigationComponent } from './navigation.component';
import { SkramblerNavVerticalItemComponent } from './vertical/nav-item/nav-vertical-item.component';
import { SkramblerNavVerticalCollapseComponent } from './vertical/nav-collapse/nav-vertical-collapse.component';
import { SkramblerNavVerticalGroupComponent } from './vertical/nav-group/nav-vertical-group.component';
import { SkramblerNavHorizontalItemComponent } from './horizontal/nav-item/nav-horizontal-item.component';
import { SkramblerNavHorizontalCollapseComponent } from './horizontal/nav-collapse/nav-horizontal-collapse.component';

@NgModule({
    imports     : [
        SharedModule,
        RouterModule
    ],
    exports     : [
        SkramblerNavigationComponent
    ],
    declarations: [
        SkramblerNavigationComponent,
        SkramblerNavVerticalGroupComponent,
        SkramblerNavVerticalItemComponent,
        SkramblerNavVerticalCollapseComponent,
        SkramblerNavHorizontalItemComponent,
        SkramblerNavHorizontalCollapseComponent
    ]
})
export class SkramblerNavigationModule
{
}
