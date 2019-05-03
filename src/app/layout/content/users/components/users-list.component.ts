import { Component, Injector, OnInit } from "@angular/core";
import { SkramblerListingBaseComponent } from "../../../../helpers/components/listing-base.component";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { locale as english } from "../i18n/en";
import { UserService } from "../services/user.service";
import { PermissionService } from "../../../../helpers/services/permission.service";

@Component({
  selector: "app-users-list",
  templateUrl: "../templates/list.component.html",
  styleUrls: ["../styles/users-list.component.scss"]
})
export class UsersListComponent extends SkramblerListingBaseComponent implements OnInit {
/**
   * to monitor data retrieved from the resolver
   */
  private subscription$: Subscription;

  private selectedStatus: string | number;

  private selectedFilter: string | number;

  private deleteUserOptions = {};

  private deleteUserConfirmationText: string;
  private deleteUserText: string;

  
  
  constructor(injector: Injector, private _activatedRoute: ActivatedRoute,
    private _userService: UserService, public _permissionService: PermissionService) {
    super(injector);
    this.translationLoader.loadTranslations(english);
    if (!_permissionService.isAdmin()){
      this.goTo(this.routeList.DASHBOARD_HOME);
     }


    this.displayedColumnsViewArray = [
      {
        key: "name",
        value: "User Full Name",
        type: "user_full_name",
      },
      {
        key: "brand[0].name",
        value: "Brand",
        type: "text",
      },
      {
        key: "roles[0].slug",
        value: "Role",
        type: "text",
      },
      {
        key: "status",
        value: "Status",
        type: "text",
        map: {
          2: "INACTIVE",
          1: "ACTIVE",
        }
      },
      {
        key: "edit",
        value: "Edit",
        type: "link",
        icon: "edit",
        currentPath: "/" + this.routeList.USERS_LISTING,
        href: true
      },
      {
        key: "delete",
        value: "Delete",
        type: "link",
        icon: "delete"
      }
    ];
    
    this.endPointConfiguration = {
      url: this.apiList.GET_USERS,
      method: "POST",
      contentType: "application/json",
    };

    this.translate.get("TEXT.DELETE_CONFIRMATION").subscribe((res: string) => {
      this.deleteUserConfirmationText = res;
     });
     this.translate.get("TEXT.DELETE_TEXT").subscribe((res: string) => {
      this.deleteUserText = res;
     });
    

   }

  ngOnInit() {
    this.setupSearchSubscriber();
  }

   /**
   * the following method used to get edit or delete page.
   */
  onClick(event: { element: any, action: any }) {
    const user = event.element;
    if (event.action.key === "edit") {
      this.router.navigate([user.business_reference_id], { relativeTo: this.route.parent })
        .then(() => null)
        .catch(() => null);
    }
    else if (event.action.key === "delete") {
      this.deleteUserOptions = {
        title: this.deleteUserConfirmationText,
        text: this.deleteUserText,
      };
      const dialogRef = this.confirmDeleteItem(this.deleteUserOptions);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteUser(user.business_reference_id);
        }
      });
    }
  }

   /**
   * the following method used to delete user.
   * @param business_reference_id 
   */
  private deleteUser(id: string) {
      this._userService.deleteUser(id)
      .subscribe((response: any) => {
        if (response) {
          if (response) {
            this.isSuccessful(<string>response.message);
            this.table.loadResourcesPage(this.constantList.DEFAULT_PAGE_INDEX);
          }
        }
      }, errorMessageArray => {
        this.isFailure(errorMessageArray);
      });
  }
    /**
   * the following is called when the status is changed
   * @param selected 
   */
  onStatusChange(selected: any) {
    if (selected) {
      this.selectedStatus = selected.value;
      this.table.requestBody["account_status"] = this.selectedStatus;
      this.table.loadResourcesPage(this.constantList.DEFAULT_PAGE_INDEX);
    }
  }

      /**
   * the following is called when the role is changed on filter
   * @param selected 
   */
  onRoleChange(selected: any) {
    if (selected) {
      this.selectedStatus = selected.value;
      this.table.requestBody["role"] = this.selectedStatus;
      this.table.loadResourcesPage(this.constantList.DEFAULT_PAGE_INDEX);
    }
  }


}
