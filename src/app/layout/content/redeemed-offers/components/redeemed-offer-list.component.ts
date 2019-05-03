import { Component, Injector, OnInit, OnDestroy } from "@angular/core";

import { locale as english } from "../i18n/en";
import { SkramblerListingBaseComponent } from "../../../../helpers/components/listing-base.component";
import { ActivatedRoute } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { PermissionService } from "../../../../helpers/services/permission.service";
import { RedeemedOfferService} from "../services/redeemed-offer.service";

@Component({
  selector: "app-redeemed-offer-list",
  templateUrl:  "../templates/list.component.html",
  styleUrls: ["../styles/redeemed-offer-list.component.scss"]
})
export class RedeemedOfferListComponent extends SkramblerListingBaseComponent implements OnInit  {

   /**
   * to monitor data retrieved from the resolver
   */
  private subscription$: Subscription;

  private selectedOfferTypeId: string | number;

  private selectedFilter: string | number;

  public filter = {};
  constructor(injector: Injector, private _activatedRoute: ActivatedRoute,
    private _redeenedService: RedeemedOfferService,
    public _permissionService: PermissionService) {
      super(injector);
      this.translationLoader.loadTranslations(english);
  
      this.paramsFilter = [
        {
          type: "option",
          key: "offer_type_id",
          placeholder: english.data.FILTERS.OFFER_TYPE.PLACEHOLDER,
          dropdowns: this.constantList.OFFER_TYPES_FILTERS
        },
        {
          type: "option",
          key: "gender",
          placeholder: english.data.FILTERS.GENDER.PLACEHOLDER,
          dropdowns: this.constantList.GENDER
        }, {
          type: "option",
          key: "age",
          placeholder: english.data.FILTERS.AGE.PLACEHOLDER,
          dropdowns: this.constantList.AGE_LIMIT_FILTER
        },
        {
          type: "option",
          key: "kind_id",
          placeholder: english.data.FILTERS.OFFER_KIND.PLACEHOLDER,
          dropdowns: this.constantList.KIND_OFFER_TYPES_FILTER
        },
        {
          type: "date",
          placeholder: english.data.FILTERS.FROM_DATE.PLACEHOLDER,
          key: "from_date"
        }, {
          type: "date",
          placeholder: english.data.FILTERS.TO_DATE.PLACEHOLDER,
          key: "to_date"
        }
      ];
  
      this.displayedColumnsViewArray = [
        {
          key: "business_reference_id",
          value: "ID",
          type: "text",
        },
        {
          key: "offer.kind.name",
          value: "Offer Kind",
          type: "text"
        },
        {
          key: "offer.type.name",
          value: "Offer Type",
          type: "tooltip",
          class: "block-with-text",
          tooltip: true
        },
        {
          key: "points_earned_data",
          value: "Points",
          type: "text",
          sortable: true,
          callback: record => {
            let points;
            points = record.offer ? record.offer.points_earned : "";
            return points;
          }
        },
        {
          key: "fees_data",
          value: "CPR",
          type: "text",
          sortable: true,
          callback: record => {
            let fees;
            fees = record.offer ? record.offer.fees : "";
            return fees;
          }
        },
        {
          key: "created_at",
          value: "Date and time",
          type: "text",
        },
        {
          key: "user.profile.gender",
          value: "Gender",
          type: "text"
        },
        {
          key: "user.profile.school",
          value: "School",
          type: "text"
        },
        {
          key: "user.profile.dob",
          value: "Age",
          type: "age"
        },
        {
          key: "branch.name",
          value: "Branch Name",
          type: "text"
        },
        {
          key: "offer",
          value: "Description",
          type: "text",
          callback: offer => {
            let description_txt = "";
            description_txt =  offer.description.length > 40 ? offer.description.substring(0, 40) + "..." : offer.description;

            return description_txt;
          }
        }
      ];

      if (this._permissionService.isAdmin()){
        this.displayedColumnsViewArray.splice(6, 0, {
          key: "branch.brand.name",
          value: "Brand Name",
          type: "text"
        });

        this.displayedColumnsViewArray.splice(1, 0, {
          key: "user.user_skrambler_id",
            value: "Skrambler ID",
          type: "text",
        });

      }
      else{
        this.displayedColumnsViewArray.splice(2, 0,   {
          key: "user.user_skrambler_id",
          value: "Skrambler ID",
          type: "text"
        });
      }
  
      this.endPointConfiguration = {
        url: this.apiList.GET_REDEMMED_OFFERS,
        method: "POST",
        contentType: "application/json",
      };
    }

  ngOnInit() {
    this.setupSearchSubscriber();
  }

    /**
   * the following is called when the offer type filter change.
   * @param selected 
   */
  onOfferTypeChange(selected: any) {
    if (selected) {
      this.selectedOfferTypeId = selected.value;
      this.table.requestBody["offer_type_id"] = this.selectedOfferTypeId;
      this.table.loadResourcesPage(this.constantList.DEFAULT_PAGE_INDEX);
    }
  }

    /**
   * the following is called when the gender filter change.
   * @param selected 
   */
  onGenderChange(selected: any) {
    if (selected) {
      this.selectedFilter = selected.value;
      this.table.requestBody["gender"] = this.selectedFilter;
      this.table.loadResourcesPage(this.constantList.DEFAULT_PAGE_INDEX);
    }
  }

      /**
   * the following is called when the age filter change.
   * @param selected 
   */
  onAgeChange(selected: any) {
    if (selected) {
      this.selectedFilter = selected.value;
      this.table.requestBody["age"] = this.selectedFilter;
      this.table.loadResourcesPage(this.constantList.DEFAULT_PAGE_INDEX);
    }
  }

  /**
   * the following is called when the offer type is changed
   * @param selected
   */
  onOfferChange(selected: any) {
    if (selected) {
      this.selectedFilter = selected.value;
      this.table.requestBody["kind_id"] = this.selectedFilter;
      this.table.loadResourcesPage(this.constantList.DEFAULT_PAGE_INDEX);
    }
  }

  /**
   * The following method is used to excel file download
   */

  onExport(): void{
    this._redeenedService.exportRedeemedOffers()
      .subscribe((response: any) => {
        if (response) {
          this.isSuccessful(<string>response.message);
        }
      }, errorMessageArray => {
        this.isFailure(errorMessageArray);
      });
  }

}
