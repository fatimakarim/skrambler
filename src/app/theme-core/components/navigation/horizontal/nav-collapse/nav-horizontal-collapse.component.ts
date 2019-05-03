import { Component, HostBinding, HostListener, Input, OnDestroy } from '@angular/core';
import { SkramblerAnimations } from '../../../../animations';
import { SkramblerConfigService } from '../../../../services';
import { Subscription } from 'rxjs';

@Component({
  selector   : 'skrambler-nav-horizontal-collapse',
  templateUrl: './nav-horizontal-collapse.component.html',
  styleUrls  : ['./nav-horizontal-collapse.component.scss'],
  animations : SkramblerAnimations
})
export class SkramblerNavHorizontalCollapseComponent implements OnDestroy {
  onSettingsChanged: Subscription;
  gpulseSettings: any;
  isOpen = false;

  @HostBinding('class') classes = 'nav-item nav-collapse';
  @Input() item: any;

  @HostListener('mouseenter')
  open() {
    this.isOpen = true;
  }

  @HostListener('mouseleave')
  close() {
    this.isOpen = false;
  }

  constructor(
    private gpulseConfig: SkramblerConfigService
  ) {
    this.onSettingsChanged =
      this.gpulseConfig.onSettingsChanged
        .subscribe(
          (newSettings) => {
            this.gpulseSettings = newSettings;
          }
        );
  }

  ngOnDestroy() {
    this.onSettingsChanged.unsubscribe();
  }
}
