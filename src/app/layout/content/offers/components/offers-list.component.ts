import { Component, Injector, OnInit, OnDestroy, Input, SimpleChanges } from "@angular/core";

import { locale as english } from "../i18n/en";
import { SkramblerListingBaseComponent } from "../../../../helpers/components/listing-base.component";
import { ActivatedRoute } from "@angular/router";
import { Subscription, Observable, } from "rxjs";
import { FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material";
import { Category } from "../../categories/models/Category";
import { map, startWith, debounceTime } from "rxjs/operators";
@Component({
  selector: "skrambler-offer-list",
  templateUrl: "../templates/list.component.html",
  styleUrls: ["../styles/offer-list.component.scss"],
})
export class OffersListComponent extends SkramblerListingBaseComponent implements OnInit {

  /**
   * the following holds the selectedStatus Variable
   */
  private selectedStatus: string | number;
  /**
   * formControl used to monitor changes in the search field
   */
  public searchBranch = new FormControl();

  @Input() brandBusiness_reference_id: string;

  /**
   * the following holds the business reference id of the respective brand
   */
  public brandId: string;


  constructor(injector: Injector, private _activatedRoute: ActivatedRoute,
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
        key: "business_reference_id",
        value: "ID",
        type: "text",
      },
      {
        key: "element",
        value: "Branch Name(s)",
        type: "text",
        class: "block-with-text",
        tooltip: true,
        callback: element => {
          let value: any;
          if (element.kind_id === this.constantList.OFFER_TYPE_LOYALTY_ID) {
            value = "ALL" ;
          } else {
             value = element.branch_offer.map(function (branch) {
              return branch.name;
            }).join(",");
          }
          return value ;
        }
      },
      {
        key: "kind.name",
        value: "Offer Kind",
        type: "text"
      },
      {
        key: "type.name",
        value: "Type",
        type: "text",
        class: "block-with-text",
        tooltip: true,

      },
      {
        key: "begin_date",
        value: "From Date",
        type: "text"
      },
      {
        key: "end_date",
        value: "To Date",
        type: "text"
      },
      {
        key: "description",
        value: "Description",
        type: "text",
        class: "ellipse-description"
      },
      {
        key: "redeemed_count",
        value: "Redeemed count",
        type: "text"
      },
      {
        key: "element1",
        value: "Status",
        type: "text",

        callback: status => {
          let statusValue = "" ;
          if (status.approved) {
            statusValue = status.active ? "ACTIVE" : "INACTIVE" ;
          } else {
          statusValue = "PENDING" ;
        }
        return statusValue ;
        }

      },
      {
        key: "edit",
        value: "Edit",
        type: "link",
        icon: "edit",
        currentPath: "/" + this.routeList.OFFERS_LISTING,
        href: true
      }
      
    ];

  

    this.endPointConfiguration = {
      url: this.apiList.GET_OFFERS,
      method: "POST",
      contentType: "application/json",
    };
  }

  ngOnInit() {
    this.table.requestBody["per_page"] = 5;
    // this.setupSearchSubscriber();
    if (this.brandBusiness_reference_id){
      this.table.requestBody["brand_id"] = this.brandBusiness_reference_id;
      this.brandId = this.brandBusiness_reference_id;
    }
    else{
      this.route.params.subscribe(params => {
        this.table.requestBody["brand_id"] = params["id"];
        this.brandId = params["id"];
      });
    }
    

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

  ngOnChanges(changes: SimpleChanges) {
    // trigger when brand changed on dashboar page.
    if (changes.brandBusiness_reference_id && !changes.brandBusiness_reference_id.isFirstChange()){
      this.table.requestBody["brand_id"] = changes["brandBusiness_reference_id"].currentValue;
      this.brandId = this.brandBusiness_reference_id;
      this.table.loadResourcesPage(this.constantList.DEFAULT_PAGE_INDEX);
    }
 
  }

  onClick(event: { element: any, action: any }) {
    const offer = event.element;
    if (event.action.key === "edit") {
      this.router.navigateByUrl(this.routeList.OFFERS_LISTING + "/" + offer.business_reference_id)
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

  /**
   * the following is called when the offer type is changed
   * @param selected
   */
  onOfferChange(selected: any) {
    if (selected) {
      this.selectedStatus = selected.value;
      this.table.requestBody["kind_id"] = this.selectedStatus;
      this.table.loadResourcesPage(this.constantList.DEFAULT_PAGE_INDEX);
    }
  }
}
