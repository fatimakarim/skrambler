/// <reference types="@types/googlemaps" />
import { Component, Injector, OnInit, NgZone, ViewChild, ElementRef } from "@angular/core";
import { ValidatorFn, Validators } from "@angular/forms";
import { MatDialog, MatAutocompleteSelectedEvent } from "@angular/material";
import { locale as english } from "../i18n/en";
import { Branch } from "../models/Branch";
import { BranchService } from "../services/branch.service";
import { FormInterface } from "../../../../helpers/interfaces/form.interface";
import { SkramblerFormBaseComponent } from "../../../../helpers/components/form-base.component";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { Category } from "../../categories/models/Category";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { BrandService } from "../../brands/services/brand.service";
import { MapsAPILoader } from "@agm/core";
import { Brand } from "../../brands/models/Brand";
import { BrandSearchComponent } from "app/helpers/components/brand-search/brand-search.component";
// declaring the google variable
declare var google: any;
@Component({
  selector: "skrambler-brand-form",
  templateUrl: "../templates/form.component.html",
  styleUrls: ["../styles/brand-form.component.scss"],
})
export class BranchFormComponent extends SkramblerFormBaseComponent implements OnInit, FormInterface {

  /**
 * to monitor data retrieved from the resolver
 */
  private subscription$: Subscription;
  /**
   * to handle the zoom on the map
   */
  public zoom: number;

  /**
   * the following is used to keep the reference to the respective location search field
   */
  @ViewChild("locationSearch") public searchElement: ElementRef;

  /**
   * the following is used to keep the reference to the respective brand search element
   */
  @ViewChild (BrandSearchComponent) skramblerSearch: BrandSearchComponent;

  private selectedCategoryId: string | number;
  constructor(injector: Injector,
    private mapsAPILoader: MapsAPILoader,
    private _activatedRoute: ActivatedRoute,
    private _branchService: BranchService,
    private ngZone: NgZone,
    private dialog: MatDialog) {
    super(injector);
    // this.canAccessModule("categories");
    this.translationLoader.loadTranslations(english);
    this.baseModel = new Branch();
  }

  ngOnInit() {
    this.setPageTitle();
    // overidding the above because EDIT & ADD title overlapp for between branch and brand
    // as they both are loaded from the same component

    this.addFormValidations();
    // resolving the categories dropdown
    this.subscription$ = this._activatedRoute.data.subscribe(
      (response: {
        branch?: { branch: Branch }
        brand?: { brand: Brand }
      }) => {
        // if branch object is set
        if (response.branch) {
          this.setupBranchDetails(response.branch.branch);
        }
        // if brand object is set
        if (response.brand) {
          this.baseModel.brand = response.brand.brand;
          this.skramblerSearch.preSelectedBrand = this.baseModel.brand;
        }
      });

    // load the google map for picking up the location
    this.loadPlaceMap();

  }

  /**
   * the following method overides the implementation in the base component
   */
  setPageTitle() {
    this.route.params.subscribe(params => {
      // in EDIT Mode
      if (params["id"]) {
        if (params["id"].indexOf("BRD") > -1) {
          this.translate.get("TEXT.ADD_BRANCH_TITLE").subscribe((res: string) => {
            this.pageTitle = res;
          });
        } else {
          this.translate.get("TEXT.EDIT_BRANCH_TITLE").subscribe((res: string) => {
            this.pageTitle = res;
          });
        }
      } else {
        this.translate.get("TEXT.ADD_BRANCH_TITLE").subscribe((res: string) => {
          this.pageTitle = res;
        });
      }
    });
  }

  /**
   * the following method is used to setup the brand details
   * @param brandData 
   */
  private setupBranchDetails(branchData: any) {
    // directly mapping the properties that matches the proerpties name of the brand model
    this.baseModel.mapValues(branchData);
    this.baseModel.setupBranchTimeDetails();
    this.formGroup.patchValue({
      ...this.baseModel,
    });
  }
  /**
   * the following method is used to set the current position of the map
   * @param long 
   * @param lat 
   */
  private setCurrentPosition(long: number, lat: number) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (long === 0 && lat === 0) {
          this.baseModel.latitude = position.coords.latitude;
          this.baseModel.longitude = position.coords.longitude;
        } else {
          this.baseModel.latitude = lat;
          this.baseModel.longitude = long;
        }
        this.zoom = this.constantList.DEFAULT_ZOOM_LEVEL;
      });
    }
  }

  /**
   * The following method is used to add the form validations
   */
  addFormValidations(): void {
    const requiredValidation: ValidatorFn[] = [Validators.required];
    const nameValidation: ValidatorFn[] = [
      Validators.required,
      Validators.maxLength(40)
    ];
    // required number validation
    const mobileNumberValidation: ValidatorFn[] = [Validators.pattern("^(?=.*[0-9])[- +()0-9]+$"), Validators.required];

    this.addFormControlWithValidations("brand", [Validators.required]);
    this.addFormControlWithValidations("name", nameValidation);
    this.addFormControlWithValidations("description", [Validators.required]);
    this.addFormControlWithValidations("location_name", [Validators.required]);
    this.addFormControlWithValidations("phone", mobileNumberValidation);
    // adding validations against branch timings
    this.addFormControlWithValidations("branch_timings_mon_start_time", requiredValidation);
    this.addFormControlWithValidations("branch_timings_mon_end_time", requiredValidation);
    this.addFormControlWithValidations("branch_timings_mon_status");
    this.addFormControlWithValidations("branch_timings_tues_start_time", requiredValidation);
    this.addFormControlWithValidations("branch_timings_tues_end_time", requiredValidation);
    this.addFormControlWithValidations("branch_timings_tues_status");
    this.addFormControlWithValidations("branch_timings_wed_start_time", requiredValidation);
    this.addFormControlWithValidations("branch_timings_wed_end_time", requiredValidation);
    this.addFormControlWithValidations("branch_timings_wed_status");
    this.addFormControlWithValidations("branch_timings_thurs_start_time", requiredValidation);
    this.addFormControlWithValidations("branch_timings_thurs_end_time", requiredValidation);
    this.addFormControlWithValidations("branch_timings_thurs_status");
    this.addFormControlWithValidations("branch_timings_frid_start_time", requiredValidation);
    this.addFormControlWithValidations("branch_timings_frid_end_time", requiredValidation);
    this.addFormControlWithValidations("branch_timings_frid_status");
    this.addFormControlWithValidations("branch_timings_sat_start_time", requiredValidation);
    this.addFormControlWithValidations("branch_timings_sat_end_time", requiredValidation);
    this.addFormControlWithValidations("branch_timings_sat_status");
    this.addFormControlWithValidations("branch_timings_sun_start_time", requiredValidation);
    this.addFormControlWithValidations("branch_timings_sun_end_time", requiredValidation);
    this.addFormControlWithValidations("branch_timings_sun_status");
  }

  loadPlaceMap(): void {
    // set google maps defaults
    this.zoom = this.constantList.DEFAULT_ZOOM_LEVEL;
    this.baseModel.latitude = this.isEditMode() ? this.baseModel.latitude : this.constantList.DEFAULT_LATITUDE;
    this.baseModel.longitude = this.isEditMode() ? this.baseModel.longitude : this.constantList.DEFAULT_LONGITUDE;
    // set current position
    if (!this.isEditMode()) {
      this.setCurrentPosition(0, 0);
    }

    // load Places Auto-complete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          if (place.formatted_phone_number) {
            this.baseModel.phone = place.formatted_phone_number;
            this.formGroup.controls.phone.setValue(this.baseModel.phone);
          }

          if (place.rating) {
            this.baseModel.review = place.rating;
          }
          if (place.opening_hours) {
            // if the place doen't open 24 hours all days
            if (place.opening_hours.periods.length > 1) {
              this.baseModel.branch_timings_mon_start_time = place.opening_hours.periods[0] ? (place.opening_hours.periods[0].open.time.substr(0, 2) + ":" + place.opening_hours.periods[0].open.time.substr(2)) : "00:00";
              this.baseModel.branch_timings_mon_end_time = place.opening_hours.periods[0] ? (place.opening_hours.periods[0].close.time.substr(0, 2) + ":" + place.opening_hours.periods[0].close.time.substr(2)) : "00:00";
              this.baseModel.branch_timings_tues_start_time = place.opening_hours.periods[1] ? (place.opening_hours.periods[1].open.time.substr(0, 2) + ":" + place.opening_hours.periods[1].open.time.substr(2)) : "00:00";
              this.baseModel.branch_timings_tues_end_time = place.opening_hours.periods[1] ? (place.opening_hours.periods[1].close.time.substr(0, 2) + ":" + place.opening_hours.periods[1].close.time.substr(2)) : "00:00";
              this.baseModel.branch_timings_wed_start_time = place.opening_hours.periods[2] ? (place.opening_hours.periods[2].open.time.substr(0, 2) + ":" + place.opening_hours.periods[2].open.time.substr(2)) : "00:00";
              this.baseModel.branch_timings_wed_end_time = place.opening_hours.periods[2] ? (place.opening_hours.periods[2].close.time.substr(0, 2) + ":" + place.opening_hours.periods[2].close.time.substr(2)) : "00:00";
              this.baseModel.branch_timings_thurs_start_time = place.opening_hours.periods[3] ? (place.opening_hours.periods[3].open.time.substr(0, 2) + ":" + place.opening_hours.periods[3].open.time.substr(2)) : "00:00";
              this.baseModel.branch_timings_thurs_end_time = place.opening_hours.periods[3] ? (place.opening_hours.periods[3].close.time.substr(0, 2) + ":" + place.opening_hours.periods[3].close.time.substr(2)) : "00:00";
              this.baseModel.branch_timings_frid_start_time = place.opening_hours.periods[4] ? (place.opening_hours.periods[4].open.time.substr(0, 2) + ":" + place.opening_hours.periods[4].open.time.substr(2)) : "00:00";
              this.baseModel.branch_timings_frid_end_time = place.opening_hours.periods[4] ? (place.opening_hours.periods[4].close.time.substr(0, 2) + ":" + place.opening_hours.periods[4].close.time.substr(2)) : "00:00";
              this.baseModel.branch_timings_sat_start_time = place.opening_hours.periods[5] ? (place.opening_hours.periods[5].open.time.substr(0, 2) + ":" + place.opening_hours.periods[5].open.time.substr(2)) : "00:00";
              this.baseModel.branch_timings_sat_end_time = place.opening_hours.periods[5] ? (place.opening_hours.periods[5].close.time.substr(0, 2) + ":" + place.opening_hours.periods[5].close.time.substr(2)) : "00:00";
              this.baseModel.branch_timings_sun_start_time = place.opening_hours.periods[6] ? (place.opening_hours.periods[6].open.time.substr(0, 2) + ":" + place.opening_hours.periods[6].open.time.substr(2)) : "00:00";
              this.baseModel.branch_timings_sun_end_time = place.opening_hours.periods[6] ? (place.opening_hours.periods[6].close.time.substr(0, 2) + ":" + place.opening_hours.periods[6].close.time.substr(2)) : "00:00";
            }
          } else {
            this.baseModel.resetTimings();
          }
          this.baseModel.location_name = this.searchElement.nativeElement.value; // place.name;
          // set latitude, longitude and zoom
          this.baseModel.latitude = place.geometry.location.lat();
          this.baseModel.longitude = place.geometry.location.lng();
          if (place.rating) this.baseModel.review = place.rating;
          this.zoom = this.constantList.DEFAULT_ZOOM_LEVEL;

          // updating form with respective changes of timings
          this.formGroup.patchValue({
            ...this.baseModel
          });
        });
      });
    });
  }

  /**
   * the following updates the longitude and latitude based on the dragged search
   * @param event 
   */
  markerDragEnd(event: any) {
    this.baseModel.longitude = event.coords.lng;
    this.baseModel.latitude = event.coords.lat;
  }

  /**
   * the following is called when the category is changed
   * @param selected 
   */
  onBrandChange(event: any) {
    if (event) {
      this.baseModel.brand = event.brand;
    }
  }
  /**
   * The following method is used to handle the form submission
   */
  onSubmit(): void {
    // if the form is valid
    if (this.formGroup.status === this.constantList.VALID_FORM_STATE) {
      this.processForm();
    }
  }
  /**
   * the following method is used to process form for submission
   */
  private processForm() {
    // so that the SAVE button gets disabled
    this.setFormDataForSubmission().then(result => {
      if (result) {
        this._branchService.addBranch(this.formData, this.baseModel.business_reference_id)
          .subscribe((response: any) => {
            if (response) {
              if (response) {
                this.isSuccessful(<string>response.message, [this.routeList.BRAND_VIEW, this.baseModel.brand.business_reference_id].join("/"));
              }
            }
          }, errorMessageArray => {
            this.isFailure(errorMessageArray);
          });
      }
    }, err => {
      this.isFailure(err);
    });
  }
  /**
   * The following method is used
   * @param {string} formElement
   * @returns {string}
   */
  getErrorMessage(formElement: string): string {
    // if any errors detected else ignore
    const control = this.formGroup.get(formElement);
    if (control.errors) {
      if (control.errors.required) {
        return english.data.INPUT.GENERAL.REQUIRED_ERROR;
      } else if (control.errors.maxlength) {
        return english.data.INPUT[formElement.toUpperCase()].REQUIRED_ERROR_LENGTH
          + control.errors.maxlength.requiredLength
          + " required";
      } else if (control.errors.pattern) {
        return english.data.INPUT[formElement.toUpperCase()].PATTERN_ERROR;
      }
    } else {
      return "";
    }
  }

  /**
   * The following method is used to set the formGroup data to the respective model instance
   * @returns {CategoryFormComponent}
   */
  setFormDataForSubmission() {
    return new Promise((resolve, reject) => {
      this.formData = new FormData();
      const values = this.formGroup.getRawValue();
      if (this.baseModel.business_reference_id) this.formData.append("business_reference_id", this.baseModel.business_reference_id);
      this.formData.append("brand_id", this.baseModel.brand.business_reference_id);
      this.formData.append("location_name", values.location_name);
      this.formData.append("longitude", this.baseModel.longitude);
      this.formData.append("latitude", this.baseModel.latitude);
      this.formData.append("name", values.name);
      this.formData.append("phone", values.phone);
      this.formData.append("description", values.description);
      this.formData.append("active", this.baseModel.active ? "1" : "0" );

      // preparing the branch_timings values for the form
      Observable.range(0, 7).subscribe(index => {
        const day = index + 1;
        // based on the day of the week i.e. 1 = Monday, 2 = Tuesday and so on
        switch (day) {
          case 1: {
            this.formData.append(`branch_timings[${day}][]`, this.baseModel.branch_timings_mon_start_time);
            this.formData.append(`branch_timings[${day}][]`, this.baseModel.branch_timings_mon_end_time);
            this.formData.append(`branch_timings[${day}][]`, values.branch_timings_mon_status ? "1" : "0");
            return;
          }
          case 2: {
            this.formData.append(`branch_timings[${day}][]`, this.baseModel.branch_timings_tues_start_time);
            this.formData.append(`branch_timings[${day}][]`, this.baseModel.branch_timings_tues_end_time);
            this.formData.append(`branch_timings[${day}][]`, values.branch_timings_tues_status ? "1" : "0");
            return;
          }
          case 3: {
            this.formData.append(`branch_timings[${day}][]`, this.baseModel.branch_timings_wed_start_time);
            this.formData.append(`branch_timings[${day}][]`, this.baseModel.branch_timings_wed_end_time);
            this.formData.append(`branch_timings[${day}][]`, values.branch_timings_wed_status ? "1" : "0");
            return;
          }
          case 4: {
            this.formData.append(`branch_timings[${day}][]`, this.baseModel.branch_timings_thurs_start_time);
            this.formData.append(`branch_timings[${day}][]`, this.baseModel.branch_timings_thurs_end_time);
            this.formData.append(`branch_timings[${day}][]`, values.branch_timings_thurs_status ? "1" : "0");
            return;
          }
          case 5: {
            this.formData.append(`branch_timings[${day}][]`, this.baseModel.branch_timings_frid_start_time);
            this.formData.append(`branch_timings[${day}][]`, this.baseModel.branch_timings_frid_end_time);
            this.formData.append(`branch_timings[${day}][]`, values.branch_timings_frid_status ? "1" : "0");
            return;
          }
          case 6: {
            this.formData.append(`branch_timings[${day}][]`, this.baseModel.branch_timings_sat_start_time);
            this.formData.append(`branch_timings[${day}][]`, this.baseModel.branch_timings_sat_end_time);
            this.formData.append(`branch_timings[${day}][]`, values.branch_timings_sat_status ? "1" : "0");
            return;
          }
          case 7: {
            this.formData.append(`branch_timings[${day}][]`, this.baseModel.branch_timings_sun_start_time);
            this.formData.append(`branch_timings[${day}][]`, this.baseModel.branch_timings_sun_end_time);
            this.formData.append(`branch_timings[${day}][]`, values.branch_timings_sun_status ? "1" : "0");
            return;
          }
          default: {
            // statements; 
            return;
          }
        }
      }, err => {

      }, () => {
        resolve(true); // once iteration completed simple return
      });
    });
  }

  /**
   * The following method is used to catch changing status
   * @param event 
   */
  changeStatus(event: any) {
    this.baseModel.active = +event.checked;
  }
}
