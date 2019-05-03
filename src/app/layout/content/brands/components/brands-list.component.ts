import { Component, Injector, OnInit, OnDestroy } from "@angular/core";

import { locale as english } from "../i18n/en";
import { SkramblerListingBaseComponent } from "../../../../helpers/components/listing-base.component";
import { ActivatedRoute } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { Category } from "../../categories/models/Category";
import { PermissionService } from "../../../../helpers/services/permission.service";
import {BrandDialogFormComponent} from "./brand-dialog-form.component";
import {BrandService} from "../services/brand.service";

@Component({
  selector: "skrambler-brand-list",
  templateUrl: "../templates/list.component.html",
})
export class BrandsListComponent extends SkramblerListingBaseComponent implements OnInit {

  /**
   * to monitor data retrieved from the resolver
   */
  private subscription$: Subscription;

  /**
   * the following holds the list of categories
   */
  public parentCategories: Category[] = [];


  private selectedCategoryId: string | number;
  private selectedStatus: string | number;


  constructor(injector: Injector, private _activatedRoute: ActivatedRoute,
  private _brandService: BrandService,
  public _permissionService: PermissionService) {
    super(injector);
    this.translationLoader.loadTranslations(english);

    this.subscription$ = this._activatedRoute.data.subscribe(
      (data: any) => {
        return this.parentCategories = data.categories.categories;
      });

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
        key: "name",
        value: "Name",
        type: "text"
      },
      {
        key: "category.name",
        value: "Main Category",
        type: "text"
      },
      {
        key: "brand_sub_categories",
        value: "Category Name",
        type: "category_listing"
      },
      {
        key: "branches_count",
        value: "Branches",
        type: "text"
      },
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
        currentPath: this.routeList.BRAND_VIEW,
        href: true
      }
      
    ];

    if (this._permissionService.isAdmin()){
      this.displayedColumnsViewArray.push(
        {
          key: "edit",
          value: "Edit",
          type: "link",
          icon: "edit",
          currentPath: "/" + this.routeList.BRAND_LISTING,
          href: true
        },
        {
        key: "invoices",
        value: "Invoices",
        type: "link",
        icon: "insert_drive_file",
      }
      );
    }

    this.endPointConfiguration = {
      url: this.apiList.GET_BRANDS,
      method: "POST",
      contentType: "application/json",
    };
  }

  ngOnInit() {
    this.setupSearchSubscriber();
  }

  onClick(event: { element: any, action: any }) {
    const brand = event.element;

    if (event.action.key === "edit") {
      this.router.navigate([brand.business_reference_id], { relativeTo: this.route.parent })
        .then(() => null)
        .catch(() => null);
    } else if (event.action.key === "view") {
      this.router.navigate(["view/" + brand.business_reference_id], { relativeTo: this.route.parent })
        .then(() => null)
        .catch(() => null);
    }
    else if (event.action.key === "invoices" ) {
      const dialogRef = this.dialog.open(BrandDialogFormComponent, {
        width: "60vw",
        data: { id: brand.business_reference_id , email: brand.manager ? brand.manager.email : ""
        }
      });
      dialogRef.afterClosed().subscribe(bool => {
        if (bool) {
          this.table.loadResourcesPage(0);
        }
      });
    }
  }

  /**
   * the following is called when the category is changed
   * @param selected 
   */
  onCategoryChange(selected: any) {
    if (selected) {
      this.selectedCategoryId = selected.value;
      this.table.requestBody["category_id"] = this.selectedCategoryId;
      this.table.loadResourcesPage(this.constantList.DEFAULT_PAGE_INDEX);
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
   * The following method is used to excel file download
   */

  onExport(): void {
    this._brandService.exportBrand()
      .subscribe((response: any) => {
        if (response) {
          this.isSuccessful(<string>response.message);
        }
      }, errorMessageArray => {
        this.isFailure(errorMessageArray);
      });
  }

}
