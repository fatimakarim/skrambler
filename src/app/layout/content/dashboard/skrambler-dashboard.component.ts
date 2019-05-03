import { Component, OnInit, Injector, ViewChild, AfterViewInit } from "@angular/core";
import { locale as english } from "./i18n/en";
import { SkramblerBaseComponent } from "../../../helpers/components/base.component";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { Category } from "../../content/categories/models/Category";
import { BrandService } from "../brands/services/brand.service";
import { Brand } from "../brands/models/Brand";
import { PermissionService } from "../../../helpers/services/permission.service";
import { BrandSearchComponent } from "app/helpers/components/brand-search/brand-search.component";
import { Dashboard } from "./models/Dashboard";
import { MatSelectChange } from "@angular/material";
import { GoogleMapsAPIWrapper, AgmMap, LatLngBounds, LatLngBoundsLiteral } from "@agm/core";
import { MapsAPILoader } from "@agm/core";
import { Branch } from "../branches/models/Branch";


@Component({
  selector: "skrambler-dashboard",
  templateUrl: "./skrambler-dashboard.component.html",
  styleUrls: ["./skrambler-dashboard.component.scss"]
})
export class SkramblerDashboardComponent extends SkramblerBaseComponent implements OnInit, AfterViewInit {


  /**
* to monitor data retrieved from the resolver
*/

  /**
     * the following holds the list of categories
     */
  public parentCategories: Category[] = [];

  /**
    * the following holds  brand info selected after category.
    */
  public brand: Brand;

  public branchesInfo: any;

  // used to show dashboard infor on template.
  public showData = false;

  private subscription$: Subscription;

  selectedCategory: any;

  public branchInfo: any;
  public branchOffers: any;
  public markerList: any;
  bounds: any;

  // bounds: LatLngBounds = new google.maps.LatLngBounds();
  lat = 25.204;
  lng = 55.2708;
  branchData = false;
  selectedCategoryId: any;
  /**
 * the following keeps the reference of the brand search input
 */
  @ViewChild(BrandSearchComponent) skramblerSearch: BrandSearchComponent;

  @ViewChild("AgmMap") agmMap: AgmMap;
  zoom = this.constantList.DEFAULT_ZOOM_LEVEL;
  latlngBounds: any;
  map: AgmMap;

  constructor(private injector: Injector, private _activatedRoute: ActivatedRoute,
    private _brandService: BrandService, public _permissionService: PermissionService) {
    super(injector);
    this.translationLoader.loadTranslations(english);
    this.baseModel = new Dashboard();
  }



  ngOnInit(): void {
    // resolving the categories dropdown
    if (this._permissionService.isAdmin()) {
      this.subscription$ = this._activatedRoute.data.subscribe(
        (response: {
          categories?: { categories: Category[] }
        }) => {

          this.parentCategories = response.categories.categories;
        });
    }
    else if (this.userService.user.brand) {
      this._brandService.getBrandDetail(this.userService.user.brand.business_reference_id).subscribe((data) => {
        this.brand = data;
        this.baseModel.brand = this.brand;
        this.showData = true;
        this.branchesInfo = {
          totalBranches: this.brand.branches.length,
          activeBranches: this.brand.branches.filter(x => x.active === 1).length,
          inactiveBranches: this.brand.branches.filter(x => x.active !== 1).length
        };
        this.markerList = this.brand.branches;
      
        this.parentCategories.push(this.brand.category);
        this.selectedCategoryId = this.brand.category_id;
        this.skramblerSearch.setBrand(this.brand, true);
        this.findBounds(this.agmMap);
      });
    }


  }
  ngAfterViewInit() {
    this.skramblerSearch.brand.disable();
    this.cd.detectChanges();
  }

   /**
  * the following is called when the category is changed
  * @param selected 
  */
  onCategoryChange(selected: any) {
    if (selected) {
      this.selectedCategory = selected.value;
      this.skramblerSearch.brand.updateValueAndValidity();
      this.skramblerSearch.brand.setValue(null);
      if (this.selectedCategory !== undefined)
        this.skramblerSearch.brand.enable();
      else
        this.skramblerSearch.brand.disable();
    }
  }

  /**
  * the following is called when the brand is changed
  * @param selected 
  */
  onBrandChange(event: any) {
    if (event) {
      this.baseModel.brand = event.brand;
      this._brandService.getBrandDetail(this.baseModel.brand.business_reference_id).subscribe((data) => {
        this.brand = data;
        this.showData = true;
        this.branchesInfo = {
          totalBranches: this.brand.branches.length,
          activeBranches: this.brand.branches.filter(x => x.active === 1).length,
          inactiveBranches: this.brand.branches.filter(x => x.active !== 1).length
        };
        this.markerList = [];
        this.markerList = this.brand.branches;
        // this.findBounds(this.agmMap);
        if (this.agmMap) this.agmMap.mapReady.next();
      });
    } else {
      this.baseModel.brand.business_reference_id = null;
      // emptying the brand search input if role is changed
      if (this.skramblerSearch.brand) this.skramblerSearch.brand.setValue("");
    }

  }
  redirectToBranch(){
    this.router.navigateByUrl([this.routeList.BRANCH_CREATE, this.baseModel.brand.business_reference_id].join("/"));
  }

  /**
  * the following is used to get the branch detail
  */

  onSelectBranchChange(event: MatSelectChange) {
    this.branchInfo = null;
    this.branchInfo = event.value;
    this.lat = this.branchInfo.latitude;
    this.lng = this.branchInfo.longitude;
    this.branchData = true;

  }

  /**
  * the following method is used to set marker on map, converts marker from json string to number.
  */
  convertStringToNumber(value: string): number {
    return +value;
  }

  /**
  * the following method is used when map gets ready and call fitBounds.
  */
  onMapReady(map: AgmMap) {
    this.map = map;
    this.findBounds(this.map);
  }

  
 /**
  * the following method is used fit bound the map for dashboard.
  */
  public findBounds(map): void {
    const bounds = new google.maps.LatLngBounds(null);
    for (let i = 0; i < this.markerList.length; i++) {
      bounds.extend(new google.maps.LatLng(this.markerList[i].latitude, this.markerList[i].longitude));
    }
    if (map) {
      map.fitBounds(bounds);
    }
  }

  /**
  * the following method is used to show branch detail on select of map branch marker.
  */
  markerClicked(event: any, branch: Branch){
   
    this.branchInfo = null;
    this.branchInfo = branch;
    this.lat = this.branchInfo.latitude;
    this.lng = this.branchInfo.longitude;
    this.branchData = true;
  }



}

