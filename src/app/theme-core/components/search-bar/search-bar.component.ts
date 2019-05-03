import {
  Component, EventEmitter, OnInit, Output, ChangeDetectorRef, ViewChild, ElementRef,
  ViewRef, OnDestroy
} from "@angular/core";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";

import { SkramblerConfigService } from "../../services/config.service";
import { SharedDataService } from "../../../helpers/services/shared-data.service";

import { Subscription } from "rxjs";

@Component({
  selector: "skrambler-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.scss"]
})
export class SkramblerSearchBarComponent implements OnInit, OnDestroy {
  collapsed: boolean;
  toolbarColor: string;
  @Output() onInput: EventEmitter<any> = new EventEmitter();
  onSettingsChanged: Subscription;

  @ViewChild("searchInput")
  private searchInput: ElementRef;


  constructor(private gpulseConfig: SkramblerConfigService,
    private sharedDataService: SharedDataService,
    private router: Router,
    private cdRef: ChangeDetectorRef) {
    this.collapsed = true;
    this.onSettingsChanged =
      this.gpulseConfig.onSettingsChanged
        .subscribe(
          (newSettings) => {
            this.toolbarColor = newSettings.colorClasses.toolbar;
          }
        );

    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationStart) {
          this.collapsed = true;
          // reset the search bar as soon as the navigation starts
          this.searchInput.nativeElement.value = null;
        }

        this.destroyDetectChange();
      });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.destroyDetectChange();
  }

  destroyDetectChange() {
    setTimeout(() => {
      if (this.cdRef !== null &&
        this.cdRef !== undefined &&
        !(this.cdRef as ViewRef).destroyed) {
        this.cdRef.detectChanges();
      }
    }, 250);
  }

  collapse() {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = null;
    }
    this.collapsed = true;
    this.onInput.emit(-1);
  }

  expand() {
    this.collapsed = false;
  }

  search(event) {
    const value = event.target.value;
    if (value && value !== "") {
      this.onInput.emit(value);
    }
  }

}
