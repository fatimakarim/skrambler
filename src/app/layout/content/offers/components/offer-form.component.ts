import {Component, Injector, OnInit, ViewChild} from "@angular/core";
import {ValidatorFn, Validators} from "@angular/forms";

import {MatDialog, MatAutocompleteSelectedEvent} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";

import {locale as english} from "../i18n/en";
import {FormInterface} from "../../../../helpers/interfaces/form.interface";
import {SkramblerFormBaseComponent} from "../../../../helpers/components/form-base.component";
import {ImageCropDialogComponent} from "../../../../helpers/components/image-cropper/image-crop-dialog.component";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Category} from "../../categories/models/Category";
import {Observable, from} from "rxjs";
import {map, startWith, debounceTime, distinctUntilChanged, switchMap, skip} from "rxjs/operators";
import {OfferService} from "../services/offer.service";
import {Offer} from "../models/Offer";
import * as moment from "moment";
import {Branch} from "../../branches/models/Branch";
import {BrandSearchComponent} from "app/helpers/components/brand-search/brand-search.component";
import {Brand} from "../../brands/models/Brand";
import {PermissionService} from "../../../../helpers/services/permission.service";
import {DialogComponent} from "../../../../helpers/components/dialog/dialog.component";

@Component({
  selector: "skrambler-offer-form",
  templateUrl: "../templates/form.component.html",
  styleUrls: ["../styles/offer-form.component.scss"],
})
export class OfferFormComponent extends SkramblerFormBaseComponent implements OnInit, FormInterface {

  /**
   * to monitor data retrieved from the resolver
   */
  private subscription$: Subscription;


  /**
   * the following holds the sub-categories coming from the respective API
   */
  public branches: any[] = [];

  /**
   * the following holds the tags chips list i.e. the selected list of the tags by the user
   */
  public branchesChipList: any[] = [];

  /**
   * the following holds the filtered tags based on user entered query
   */
  public filteredBranches: Observable<any[]>;

  /**
   * used for restricting min date selection on the date picker
   */
  minDate: Date = new Date();

  /**
   * the following is used to keep the reference to the respective brand search element
   */
  @ViewChild(BrandSearchComponent) skramblerSearch: BrandSearchComponent;

  /**
   * used for form disable when offer staus not approved
   */

  formDisbled = true;


  private selectedCategoryId: string | number;


  private deleteUserOptions = {};

  private deleteUserConfirmationText: string;
  private deleteUserText: string;

  constructor(injector: Injector,
              private _activatedRoute: ActivatedRoute,
              private _offerService: OfferService,
              private dialog: MatDialog, public _permissionService: PermissionService) {
    super(injector);
    // this.canAccessModule("categories");
    this.translationLoader.loadTranslations(english);
    this.baseModel = new Offer();
    if (!this.isEditMode() && !_permissionService.isAdmin()) {
      this.goTo(this.routeList.DASHBOARD_HOME);
    }
  }

  ngOnInit() {
    this.setPageTitle();
    this.addFormValidations();

    // resolving the categories dropdown
    this.subscription$ = this._activatedRoute.data.subscribe(
      (response: {
        offer?: { offers: Offer }
        brand?: { brand: Brand }
      }) => {
        if (response.offer) this.setupOfferDetails(response.offer);
        // if brand is set
        if (response.brand) {
          // the following gets the brand objects and sets respective data
          // for branches and other required attributes
          this.baseModel.brand = response.brand.brand;
          this.skramblerSearch.preSelectedBrand = this.baseModel.brand;
          this.formGroup.get("branches").enable();
          this.branches = this.baseModel.brand.branches;
        }
      });

    this.filteredBranches = this.formGroup.get("branches").valueChanges
      .pipe(
        startWith(""),
        map(value => this.filter(this.branches, value)),
      );
  }

  /**
   * the following method is used to filter branches
   */
  private filter(array: any[], value: string): any[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return array.filter(obj => obj.name.toLowerCase().includes(filterValue));
    } else return [];
  }


  /**
   * the following method is used to populate the offer details
   * @param offerData
   */
  private setupOfferDetails(offerData: any) {
    // directly mapping the properties that matches the proerpties name of the brand model
    this.baseModel.mapValues(offerData);
    this.baseModel.active = offerData.active === 1;
    this.formGroup.patchValue({
      ...this.baseModel,
    });

    // setting up the branches dropdown data based on the respective brand
    this.branches = this.baseModel.brand.branches;
    this.formGroup.get("max_allowed_offers").disable();
    this.formGroup.get("max_allowed_offers_per_user").disable();
    this.formGroup.get("kind_id").disable();
    this.formGroup.get("branches").enable();

    // Fetching delivery type description

    if (this.baseModel.offer_delivery_types && this.baseModel.offer_delivery_types.length >= 1) {
      const selectDeliveryList = this.constantList.DELIVERY_TYPES.filter(d => this.baseModel.offer_delivery_types.find(d2 => d.delivery_type_id === d2.delivery_type_id));
      this.formGroup.get("delivery_type").setValue(selectDeliveryList);
      this.baseModel.offer_delivery_types.forEach((delivery, index) => {
        this.addDeliveryDescription(delivery.delivery_type_id, delivery);
      });
    }
    // Fetching days
    const selectDaysList = this.constantList.DEFAULT_DAYS.filter(d => this.baseModel.surprise_offer_days.find(d2 => d.value === d2.day));
    this.formGroup.get("days").setValue(selectDaysList);

    // iterating and entering tags for the front-end
    Observable.from(this.baseModel.branch_offer).subscribe(
      (branch: Branch) => {
        return this.branchesChipList.push(branch);
      });

    // Kind Offer Validation
    this.onOfferChange(this.baseModel.kind_id);


    if (!this._permissionService.isAdmin()) {
      this.disableFormFields();
    }
    this.formGroup.updateValueAndValidity();
    this.formGroup.markAsTouched();

  }

  // in case user is brand owner.
  private disableFormFields() {
    this.formGroup.get("points_earned").disable();
    this.formGroup.get("offer_type_id").disable();

    // this.formGroup.get("branches").disable();
    this.formGroup.get("description").disable();
    this.formGroup.get("begin_date").disable();
    this.formGroup.get("end_date").disable();
    this.formGroup.get("fees").disable();
    this.formGroup.get("estimated_savings").disable();
    this.formGroup.get("reactivation_days").disable();
    this.formGroup.get("no_offers").disable();
    // this.formGroup.disable();
    this.baseModel.approved ? this.formGroup.get("branches").enable() : this.formGroup.get("branches").disable();
    this.baseModel.approved ? this.formDisbled = true : this.formDisbled = false;
  }

  /**
   * the following method overrides the implementation in the base component
   */
  setPageTitle() {
    this.route.params.subscribe(params => {
      // in EDIT Mode
      if (params["id"]) {
        // if BRD is in the params it means its coming through for BRANDS for adding
        if (params["id"].indexOf("BRD") > -1) {
          this.translate.get("TEXT.ADD_OFFER_TITLE").subscribe((res: string) => {
            this.pageTitle = res;
          });
        } else {
          this.translate.get("TEXT.EDIT_OFFER_TITLE").subscribe((res: string) => {
            this.pageTitle = res;
          });
        }
      } else {
        this.translate.get("TEXT.ADD_OFFER_TITLE").subscribe((res: string) => {
          this.pageTitle = res;
        });
      }
    });
  }

  /**
   * the following is called when the category is changed
   * @param selected
   */
  onBrandChange(event: any) {
    if (event) {
      this.baseModel.brand = event.brand;
      this.branches = this.baseModel.brand.branches;
    }
  }

  /**
   *  the following method is used to remove respective tage form the chip list
   * @param tag
   */
  removeBranchChip(tag: any) {
    this.branchesChipList = this.branchesChipList.filter(item => item !== tag);
    this.setBranchValidation();
  }

  /**
   * the following method detects tag selection
   * @param selected
   */
  onBranchSelected(selected: MatAutocompleteSelectedEvent) {
    const selectedBranch = this.branches.filter((branch: any) =>
      branch.name.toLowerCase().indexOf(selected.option.value.toLowerCase()) === 0)[0];
    this.formGroup.get("branches").setValue("");
    // check if selected branch exists or not
    let doesBranchExist = false;
    from(this.branchesChipList).find((v: any) => v.name === selectedBranch.name).subscribe(response => {
      // if response found that means
      if (response) doesBranchExist = true;
    }, err => {
    }, () => {
      if (!doesBranchExist) {
        this.branchesChipList.push(selectedBranch);
        this.setBranchValidation();
      }
    });

  }

  /**
   * The following method is used to add the form validations
   */
  addFormValidations(): void {
    const nameValidation: ValidatorFn[] = [
      Validators.required,
      Validators.maxLength(40)
    ];
    const typesDescription: ValidatorFn[] = [
      Validators.maxLength(200)
    ];
    const urlValidation: ValidatorFn[] = [Validators.required,
      Validators.pattern(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)];
    const numberValidation: ValidatorFn[] = [Validators.pattern(/^([1-9]|-1)\d*$/)];

    this.addFormControlWithValidations("offer_type_id", [Validators.required]);
    this.addFormControlWithValidations("kind_id", [Validators.required]);

    this.addFormControlWithValidations("fees", [Validators.required]);
    this.addFormControlWithValidations("estimated_savings", [Validators.required]);
    this.addFormControlWithValidations("points_earned", [Validators.required]);
    this.addFormControlWithValidations("reactivation_days", [Validators.required]);
    this.addFormControlWithValidations("begin_date", [Validators.required]);
    this.addFormControlWithValidations("end_date", [Validators.required]);
    this.addFormControlWithValidations("description", [Validators.required, Validators.maxLength(80)]);
    this.addFormControlWithValidations("branches", [], this.branches.length === 0);
    this.addFormControlWithValidations("max_allowed_offers", numberValidation);
    this.addFormControlWithValidations("max_allowed_offers_per_user", numberValidation);
    this.addFormControlWithValidations("no_offers", []);
    this.addFormControlWithValidations("days", []);
    this.addFormControlWithValidations("delivery_type", []);
  }

  /**
   * The following method is used to handle the form submission
   */
  onSubmit(): void {
    // if the form is valid
    if (this.formGroup.status === this.constantList.VALID_FORM_STATE) {
      if (this.checkOfferExist()){
        const dialogRef =  this.dialog.open(DialogComponent, {
          width: this.constantList.POP_UP_DEFAULT_WIDTH,
          data: {
            title: "Alert",
            text: "This offer kind already has active offers in the system, making this offer active will disable all other offers of this kind.",
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.processForm();
          }
        });
      } else{
        this.processForm();
      }
    }
  }

  /**
   * the following method is used to process form for submissions
   */
  private processForm() {
    // so that the SAVE button gets disable

    this.setFormDataForSubmission().then(result => {
      if (result) {
        this._offerService.addOffer(this.formData, this.baseModel.business_reference_id)
          .subscribe((response: any) => {
            if (response) {
              this.isSuccessful(<string>response.message, [this.routeList.BRAND_VIEW, this.baseModel.brand.business_reference_id].join("/"));
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
  getErrorMessage(formElement: string, index?: number): string {
    // if any errors detected else ignore
    const control = this.formGroup.get(index !== undefined ? `${formElement}_${index}` : formElement);
    if (control && control.errors) {
      if (control.errors.required) {
        return english.data.INPUT.GENERAL.REQUIRED_ERROR;
      } else if (control.errors.maxlength) {
        return english.data.INPUT[formElement.toUpperCase()].REQUIRED_ERROR_LENGTH
          + control.errors.maxlength.requiredLength
          + " required";
      } else if (control.errors.min) {
        return english.data.INPUT[formElement.toUpperCase()].MIN_ERROR
          + control.errors.min.min
          + " AED";
      } else if (control.errors.max) {
        return english.data.INPUT[formElement.toUpperCase()].MAX_ERROR
          + control.errors.min.min
          + " AED";
      } else if (control.errors.pattern) {
        return english.data.INPUT[formElement.toUpperCase()].PATTERN_ERROR;
      }
    } else {
      return "";
    }
  }

  /**
   * The following method is used to check if same kind offer exist in brand
   */
  checkOfferExist(){
      const values = this.formGroup.getRawValue();

       if (values.kind_id === this.constantList.OFFER_TYPE_LOYALTY_ID) {
         return this.baseModel.brand.loyal_offers_count >= 1 && this.baseModel.active ;
        }
        else if (values.kind_id === this.constantList.OFFER_TYPE_SURPRISE_ID) {
            return this.baseModel.brand.surprise_offers_count >= 1 && this.baseModel.active ;
        }
        else if (values.kind_id === this.constantList.OFFER_TYPE_FAMILY_ID) {
              return  this.baseModel.brand.friends_family_offers_count >= 1 && this.baseModel.active;
        } else {
          return false;
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
      if (values.name)
        this.formData.append("name", values.name ? values.name : "");
      this.formData.append("brand_id", this.baseModel.brand.business_reference_id);
      this.formData.append("description", values.description);
      if (values.begin_date)
        this.formData.append("begin_date", values.begin_date ? moment(values.begin_date).format("YYYY-MM-DD") : "");
      if (values.end_date)
        this.formData.append("end_date", values.end_date ? moment(values.end_date).format("YYYY-MM-DD") : "");
      this.formData.append("points_earned", values.points_earned ? values.points_earned : "");
      if (typeof values.reactivation_days !== "undefined")
        this.formData.append("reactivation_days", values.reactivation_days);
      this.formData.append("offer_type_id", values.offer_type_id);
      this.formData.append("kind_id", values.kind_id);
      this.formData.append("fees", values.fees ? values.fees : "");
      this.formData.append("estimated_savings", values.estimated_savings);
      if (values.max_allowed_offers) {
        this.formData.append("max_allowed_offers", values.max_allowed_offers === undefined ? "0" : values.max_allowed_offers);
      }
      if (values.max_allowed_offers_per_user)
        this.formData.append("max_allowed_offers_per_user", values.max_allowed_offers_per_user === undefined ? "0" : values.max_allowed_offers_per_user);
      if (values.no_offers)
        this.formData.append("no_offers", values.no_offers ? values.no_offers : "");
      this.formData.append("active", this.baseModel.active ? "1" : "0");
      // Adding delivery type notes.
      this.baseModel.offer_delivery_types.forEach((delivery, index) => {
        this.formData.append(`delivery_types[${index}][delivery_type_id]`, delivery.delivery_type_id);
        if (values[["default_text", delivery.delivery_type_id].join("_")]) {
          this.formData.append(`delivery_types[${index}][default_text]`, `${values[["default_text", delivery.delivery_type_id].join("_")]}` ? "1" : "0");
        } else {
          this.formData.append(`delivery_types[${index}][description]`, `${values[["description", delivery.delivery_type_id].join("_")]}`);
        }
      });
      // Adding days
      Observable.range(0, values.days.length).subscribe((x) => {
        this.formData.append("days[]", values.days[x].value);
      }, error => {
        reject(error);
      }, () => {
      });

      // Adding selected BRANCHES
      Observable.range(0, this.branchesChipList.length).subscribe((x) => {
        this.formData.append("branch_id[]", this.branchesChipList[x].business_reference_id);
      }, error => {
        reject(error);
      }, () => {
        resolve(true);
      });
    });
  }

  /**
   *The following method is used to changed the offer selection type
   * @param event
   */
  onOfferChange(value: any) {
    if (value === this.constantList.OFFER_TYPE_LOYALTY_ID) {
      this.formGroup.get("begin_date").setValidators(null);
      this.formGroup.get("begin_date").setValue("");
      this.formGroup.get("end_date").setValidators(null);
      this.formGroup.get("end_date").setValue("");
      this.formGroup.get("reactivation_days").setValidators(null);
      this.formGroup.get("reactivation_days").setValue("");
      this.formGroup.get("max_allowed_offers_per_user").setValue("");
      this.formGroup.get("max_allowed_offers").setValue("");
      this.branchesChipList = [];
      this.formGroup.get("branches").setValidators(null);
      this.formGroup.get("branches").setValue("");
      this.formGroup.get("no_offers").setValidators([Validators.required]);
      this.formGroup.get("days").setValidators(null);
      this.formGroup.get("days").setValue("");
    } else if (value === this.constantList.OFFER_TYPE_SURPRISE_ID) {
      this.formGroup.get("days").setValidators([Validators.required]);
      this.formGroup.get("begin_date").setValidators(null);
      this.formGroup.get("begin_date").setValue("");
      this.formGroup.get("end_date").setValidators(null);
      this.formGroup.get("end_date").setValue("");
      this.formGroup.get("no_offers").setValidators(null);
      this.formGroup.get("no_offers").setValue("");
    } else {
      this.formGroup.get("begin_date").setValidators([Validators.required]);
      this.formGroup.get("end_date").setValidators([Validators.required]);
      this.formGroup.get("reactivation_days").setValidators([Validators.required]);
      this.formGroup.get("branches").setValidators(null);
      this.formGroup.get("no_offers").setValidators(null);
      this.formGroup.get("no_offers").setValue("");
      this.formGroup.get("days").setValidators(null);
      this.formGroup.get("days").setValue("");
    }

    this.formGroup.updateValueAndValidity();
    this.cd.detectChanges();
  }

  /**
   * THe following method is used to get the offer delivery types
   * @param event
   */

  onTypeChange(event: any) {
    if (event) {
      this.baseModel.offer_delivery_types = event.value;
      this.baseModel.offer_delivery_types.forEach(value => {
        this.addDeliveryDescription(value.delivery_type_id);
      });
    }

  }

  /**
   * The following method is used to add th delivery types of description
   * @param value
   */
  addDeliveryDescription(index: number, value?: any): void {
    const descriptionValidation: ValidatorFn[] = [
      Validators.required,
      Validators.maxLength(200),
    ];
    const notesControlName = `description_${index}`;
    const defaultControlName = `default_text_${index}`;


    this.addFormControlWithValidations(notesControlName, descriptionValidation);
    this.addFormControlWithValidations(defaultControlName);

    if (value && value.description) {
      this.formGroup.get(notesControlName).patchValue(value.description);
      this.formGroup.get(notesControlName).updateValueAndValidity({onlySelf: true});
      this.formGroup.get(notesControlName).markAsTouched({onlySelf: true});
    }
    if (value && value.default_text) {
      this.formGroup.get(defaultControlName).patchValue(value.default_text);
      this.formGroup.get(defaultControlName).updateValueAndValidity({onlySelf: true});
      this.formGroup.get(defaultControlName).markAsTouched({onlySelf: true});
    }

  }

  /**
   * The following method is used to catch changing status
   * @param event
   */
  changeStatus(event: any) {
    this.baseModel.active = event.checked;

  }

  /**
   * The following method is used to set branch validation dynamically.
   */
  private setBranchValidation(): void {
    if (this.branchesChipList.length === 0) {
      this.formGroup.get("branches").setValidators([Validators.required]);
    }
    else {
      this.formGroup.get("branches").setValidators([]);
    }
    this.formGroup.get("branches").updateValueAndValidity();
  }

  /**
   * The following method check the invalid control of add rows of contact person
   * @param elementName
   * @param index
   */
  checkInValidControl(elementName: string, index: number): boolean {
    const hasControl = this.formGroup.get(`${elementName}_${index}`);
    if (hasControl) {
      return this.formGroup.controls[`${elementName}_${index}`].invalid;
    }

    return false;
  }


  /**
   * The following method is used to check delivery type exist in  brand
   * @param id
   */

  checkDeliveryExist(id: number) {
    if (this.baseModel.brand.brand_delivery_types && this.baseModel.brand.brand_delivery_types.length >= 1) {
      return this.baseModel.brand.brand_delivery_types.find(d => d.delivery_type_id === id);
    }
    return false;
  }

  /**
   * The following method is used to brand delivery selected or not
   * @param event
   * @param elementName
   * @param index
   */
  brandOptionSelected(event: any , elementName: string, index: number){
    if (event){
      this.formGroup.get(`${elementName}_${index}`).setValidators(null);
        this.formGroup.get(`${elementName}_${index}`).disable();
    } else{
      this.formGroup.get(`${elementName}_${index}`).setValidators([Validators.required]);
      this.formGroup.get(`${elementName}_${index}`).enable();
    }
    this.formGroup.get(`${elementName}_${index}`).updateValueAndValidity();
    this.cd.detectChanges();

  }

  optionChanges(event: any, elementName: string ){
    const option = event.source;
    const formControl = this.formGroup.get(`${elementName}_${option.value.delivery_type_id}`);
    if (formControl) {
      if (!option.selected) {
        this.formGroup.get(`${elementName}_${option.value.delivery_type_id}`).setValidators(null);
      } else {
        this.formGroup.get(`${elementName}_${option.value.delivery_type_id}`).setValidators([Validators.required]);
      }
      this.formGroup.get(`${elementName}_${option.value.delivery_type_id}`).updateValueAndValidity();
      this.cd.detectChanges();
    }
  }
}
