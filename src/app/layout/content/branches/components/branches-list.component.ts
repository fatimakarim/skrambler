import { Component, Injector, OnInit, OnDestroy } from "@angular/core";

import { locale as english } from "../i18n/en";
import { SkramblerListingBaseComponent } from "../../../../helpers/components/listing-base.component";
import { ActivatedRoute } from "@angular/router";
import { FormControl } from "@angular/forms";
import { startWith, debounceTime } from "rxjs/operators";
@Component({
  selector: "skrambler-branch-list",
  templateUrl: "../templates/list.component.html",
})
export class BranchesListComponent extends SkramblerListingBaseComponent implements OnInit {

  /**
   * the following holds the selectedStatus Variable
   */
  private selectedStatus: string | number;
  /**
   * formControl used to monitor changes in the search field
   */
  public searchBranch = new FormControl();

  /**
   * the default brandId
   */
  public brandId: string;


  constructor(injector: Injector, private _activatedRoute: ActivatedRoute
  ) {
    super(injector);
    this.translationLoader.loadTranslations(english);

    this.paramsFilter = [
      {
        type: "option",
        key: "active",
        placeholder: english.data.FILTERS.STATUS.PLACEHOLDER,
        dropdowns: this.constantList.STATUSES
      }
    ];

    this.displayedColumnsViewArray = [
      {
        key: "id",
        value: "ID",
        type: "text",
      },
      {
        key: "name",
        value: "Name",
        type: "text"
      },
      {
        key: "category.name",
        value: "Location",
        type: "google_map",
        hyper_link_value: "Location",
      },
      {
        key: "code",
        value: "Branch Code",
        type: "text",
      }
      ,
      {
        key: "active",
        value: "Status",
        type: "text",
        map: {
          0: "INACTIVE",
          1: "ACTIVE",
        }
      },
      {
        key: "edit",
        value: "Edit",
        type: "link",
        icon: "edit",
        currentPath: "/" + this.routeList.BRANCHES_LISTING,
        href: true
      }
    ];

    this.endPointConfiguration = {
      url: this.apiList.GET_BRANCHES,
      method: "POST",
      contentType: "application/json",
    };
  }

  ngOnInit() {
    this.table.requestBody["per_page"] = 5;
    // this.setupSearchSubscriber();
    this.route.params.subscribe(params => {
      this.table.requestBody["brand_id"] = params["id"];
      this.brandId = params["id"];
    });

    // the following monitor changes for the change in the inputfield of search
    this.searchBranch.valueChanges
      .pipe(
        startWith(""),
        debounceTime(this.constantList.DEFAULT_DEBOUNCE_TIME)
      ).subscribe(value => {
        // setting the search param based on what user entered
        this.table.requestBody["search"] = value;
        // loading the page again from start
        this.table.loadResourcesPage(this.constantList.DEFAULT_PAGE_INDEX);
      });
  }

  onClick(event: { element: any, action: any }) {
    const branch = event.element;
    if (event.action.key === "edit") {
      this.router.navigateByUrl(this.routeList.BRANCHES_LISTING + "/" + branch.business_reference_id)
        .then(() => null)
        .catch((e) => {});
    }
  }
  /**
   * the following is called when the status is changed
   * @param selected 
   */
  onStatusChange(selected: any) {
    if (selected) {
      this.selectedStatus = selected.value;
      this.table.requestBody["active"] = this.selectedStatus;
      this.table.loadResourcesPage(this.constantList.DEFAULT_PAGE_INDEX);
    }
  }
}
