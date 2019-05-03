import { Component, Injector, OnInit, OnDestroy } from "@angular/core";
import { SkramblerListingBaseComponent } from "../../../../helpers/components/listing-base.component";
import { Subscription, Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { locale as english } from "../i18n/en";
import { PermissionService } from "../../../../helpers/services/permission.service";
import { CustomerService} from "../services/customer.service";

@Component({
  selector: "app-customer-list",
  templateUrl: "../templates/list.component.html",
  styleUrls: ["../styles/customer-list.component.scss"],
})
export class CustomerListComponent extends SkramblerListingBaseComponent implements OnInit {
/**
   * to monitor data retrieved from the resolver
   */
  private subscription$: Subscription;

  private selectedStatus: string | number;

  private selectedFilter: string | number;

  /**
   * The following object is used for show the employee role name not value on listing
   */
  private roles: Object = {};
  
  
  constructor(injector: Injector, private _activatedRoute: ActivatedRoute,
    private _customerService: CustomerService,
    public _permissionService: PermissionService) {
    super(injector);
    this.translationLoader.loadTranslations(english);
    if (this._permissionService.isNotAdmin()){
      this.goTo(this.routeList.DASHBOARD_HOME);
     }
    this.constantList.CUSTOMER_STATUSES.map((role: any) => {
      this.roles[role.value] = role.name;
    });

    this.paramsFilter = [
      {
        type: "option",
        key: "status",
        placeholder: english.data.FILTERS.STATUS.PLACEHOLDER,
        dropdowns: this.constantList.CUSTOMER_STATUSES
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
        key: "ambassador",
        placeholder: english.data.FILTERS.USER_TYPE.PLACEHOLDER,
        dropdowns: this.constantList.USER_TYPE
      },
      {
        type: "date",
        placeholder: english.data.FILTERS.FROM_DATE.PLACEHOLDER,
        key: "from_date"
      }, {
        type: "date",
        placeholder: english.data.FILTERS.TO_DATE.PLACEHOLDER,
        key: "to_date"
      },
      {
        type: "option",
        key: "with_profile_pic",
        placeholder: english.data.FILTERS.PROFILE.PLACEHOLDER,
        dropdowns: this.constantList.PROFILE_IMAGE
      },
    ];

    this.displayedColumnsViewArray = [
      {
        key: "flag",
        value: "",
        type: "icon",
      },
      {
        key: "business_reference_id",
        value: "ID",
        type: "text",
      }, {
        key: "user_skrambler_id",
        value: "Skrambler ID",
        type: "text",
      },
      {
        key: "name",
        value: "Name",
        type: "full_name",
      },
      {
        key: "profile.dob",
        value: "Age",
        type: "date_of_birth",
      }
      ,
      {
        key: "profile.gender",
        value: "Gender",
        type: "text",
      }, {
        key: "mobile_number",
        value: "Mobile #",
        type: "text",
      },
      {
        key: "points",
        value: "Points",
        type: "text",
        sortable: true,
        sort_key: "points"
      },
      {
        key: "created_at",
        value: "Register date",
        type: "text"
      },
      {
        key: "referral_code",
        value: "Referral Code",
        type: "text"
      },
      {
        key: "status",
        value: "Status",
        type: "text",
        map: this.roles
      },
      {
        key: "edit",
        value: "Edit",
        type: "link",
        icon: "edit",
        currentPath: "/" + this.routeList.CUSTOMER_HOME + "/view/",
        href: true
      }
    ];
    
    this.endPointConfiguration = {
      url: this.apiList.GET_ALL_CUSTOMERS,
      method: "POST",
      contentType: "application/json",
    };

    

   }

  ngOnInit() {
    this.setupSearchSubscriber();
  }

  onClick(event: { element: any, action: any }) {
    const customer = event.element;
    this.router.navigate(["view/" + customer.business_reference_id], { relativeTo: this.route.parent })
        .then(() => null)
        .catch(() => null);
  }

    /**
   * the following is called when the status is changed
   * @param selected 
   */
  onStatusChange(selected: any) {
    if (selected) {
      this.selectedStatus = selected.value;
      this.table.requestBody["status"] = this.selectedStatus;
      this.table.loadResourcesPage(this.constantList.DEFAULT_PAGE_INDEX);
    }
  }

      /**
   * the following is called when the gender is changed
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
   * the following is called when the age range is changed
   * @param selected 
   */
  onAgeRangeChange(selected: any) {
    if (selected) {
      this.selectedFilter = selected.value;
      this.table.requestBody["age"] = this.selectedFilter;
      this.table.loadResourcesPage(this.constantList.DEFAULT_PAGE_INDEX);
    }
  }

  /**
   * the following is called when the user type is changed
   * @param selected 
   */
  onUserTypeChange(selected: any) {
    if (selected) {
      this.selectedFilter = selected.value;
      this.table.requestBody["ambassador"] = this.selectedFilter;
      this.table.loadResourcesPage(this.constantList.DEFAULT_PAGE_INDEX);
    }
  }


  /**
   * The following method is used to excel file download
   */

  onExport(): void {
    this._customerService.exportCustomer()
      .subscribe((response: any) => {
        if (response) {
          this.isSuccessful(<string>response.message);
        }
      }, errorMessageArray => {
        this.isFailure(errorMessageArray);
      });
  }


}
