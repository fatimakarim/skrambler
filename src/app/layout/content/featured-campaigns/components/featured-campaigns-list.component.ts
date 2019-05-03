import { Component, Injector, OnInit, OnDestroy } from "@angular/core";
import { SkramblerListingBaseComponent } from "../../../../helpers/components/listing-base.component";
import { Subscription, Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { locale as english } from "../i18n/en";
import { PermissionService } from "../../../../helpers/services/permission.service";

@Component({
  selector: "app-featured-campaigns-list",
  templateUrl: "../templates/list.component.html"
})
export class FeaturedCampaignsListComponent  extends SkramblerListingBaseComponent implements OnInit{

  private selectedStatus: string | number;

  constructor(injector: Injector, private _activatedRoute: ActivatedRoute,
    public _permissionService: PermissionService) {
    super(injector);
    this.translationLoader.loadTranslations(english);


    this.displayedColumnsViewArray = [
      {
        key: "business_reference_id",
        value: "ID",
        type: "text",
      },
      {
        key: "title",
        value: "Name",
        type: "text",
      },
      {
        key: "brand.name",
        value: "Brand Name",
        type: "text",
      }
      ,
      {
        key: "start_date",
        value: "From Date",
        type: "text",
      },
      {
        key: "end_date",
        value: "Till",
        type: "text"
      },
      {
        key: "Impressions",
        value: "Impressions Left",
        type: "impressions_left"
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
        key: "view",
        value: "View",
        type: "link",
        icon: "visibility",
        currentPath: "/" + this.routeList.CAMPSIGNS_LISTING + "/view/",
        href: true
      }
      
    ];
    
    this.endPointConfiguration = {
      url: this.apiList.GET_ALL_CAMPSIGNS,
      method: "POST",
      contentType: "application/json",
    };

    if (this._permissionService.isAdmin()){
      this.displayedColumnsViewArray.push(
        {
          key: "edit",
          value: "Edit",
          type: "link",
          icon: "edit",
          currentPath: "/" + this.routeList.CAMPSIGNS_LISTING,
          href: true
        }
      );
    }

    

   }

  ngOnInit() {
    this.setupSearchSubscriber();
  }

     /**
   * the following is used to get in edit page or view page.
   */
  onClick(event: { element: any, action: any }) {
    const campaign = event.element;
    if (event.action.key === "edit") {
      this.router.navigate([campaign.business_reference_id], { relativeTo: this.route.parent })
        .then(() => null)
        .catch(() => null);
    } else if (event.action.key === "view") {
      this.router.navigate(["view/" + campaign.business_reference_id], { relativeTo: this.route.parent })
        .then(() => null)
        .catch(() => null);
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
   * the following is called when the campaign type is changed
   * @param selected 
   */
  onCampaignTypeChange(selected: any){
    if (selected) {
      this.selectedStatus = selected.value;
      this.table.requestBody["type"] = this.selectedStatus;
      this.table.loadResourcesPage(this.constantList.DEFAULT_PAGE_INDEX);
    }
  }

}
