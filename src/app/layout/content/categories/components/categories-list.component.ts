import { Component, Injector, OnInit, OnDestroy } from "@angular/core";

import { locale as english } from "../i18n/en";
import { SkramblerListingBaseComponent } from "../../../../helpers/components/listing-base.component";
import { ActivatedRoute } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { Category } from "../models/Category";
import { FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material";
import { PermissionService } from "../../../../helpers/services/permission.service";

@Component({
  selector: "skrambler-categories-list",
  templateUrl: "../templates/list.component.html",
})
export class CategoriesListComponent extends SkramblerListingBaseComponent implements OnInit {

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
  public _permissionService: PermissionService) {
    super(injector);
    this.translationLoader.loadTranslations(english);
    if (!this._permissionService.isAdmin()){
      this.goTo(this.routeList.DASHBOARD_HOME);
     }
    this.subscription$ = this._activatedRoute.data.subscribe(
      (data: { categories: { categories: Category[] } }) => {
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
        value: "Parent Category",
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
      }, {
        key: "edit",
        value: "Edit",
        type: "link",
        icon: "edit",
      }
    ];

    this.endPointConfiguration = {
      url: this.apiList.GET_SUB_CATEGORIES,
      method: "POST",
      contentType: "application/json",
    };
  }

  ngOnInit() {
    this.setupSearchSubscriber();
  }

  onClick(event: { element: any, action: any }) {
    const category = event.element;
    if (event.action.key === "edit") {
      this.router.navigate([category.id], { relativeTo: this.route.parent })
        .then(() => null)
        .catch(() => null);
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
}
