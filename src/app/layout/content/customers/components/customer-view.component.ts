import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { ValidatorFn, Validators } from "@angular/forms";
import { SkramblerFormBaseComponent } from "../../../../helpers/components/form-base.component";
import { MatDialog } from "@angular/material";
import { ImageCropDialogComponent } from "../../../../helpers/components/image-cropper/image-crop-dialog.component";
import { Profile } from "../models/profile";
import { locale as english } from "../i18n/en";
import { provideLocationStrategy } from "@angular/router/src/router_module";
import { BaseModel } from "app/helpers/models/BaseModel";
import { CustomerService } from "../services/customer.service";
import { CustomersModule } from "../customers.module";
import { PermissionService } from "../../../../helpers/services/permission.service";
import { Customer } from "../models/customer";

@Component({
  selector: "app-customer-form",
  templateUrl: "../templates/view.component.html",
  styleUrls: ["../styles/customer-view.component.scss"],
})
export class CustomerViewComponent extends SkramblerFormBaseComponent implements OnInit {

  /**
  * to monitor data retrieved from the resolver
  */
  private subscription$: Subscription;

  isUpdateUnabled = false;
  public labelEnablingButton: string;

  pageTitle: string;

  public resolvedArray: any;

  constructor(injector: Injector,
    private _activatedRoute: ActivatedRoute, private dialog: MatDialog, private _customerService: CustomerService,
    public _permissionService: PermissionService) {
    super(injector);
    this.translationLoader.loadTranslations(english);

    if (this._permissionService.isNotAdmin()){
      this.goTo(this.routeList.DASHBOARD_HOME);
    }
    this.baseModel = new Customer();
    this.translate.get("TEXT.ENABLE_EDITING").subscribe((res: string) => {
      this.labelEnablingButton = res;
    });
  }

  ngOnInit() {
    super.setPageTitle();
    // resolving the customer data
    this.subscription$ = this._activatedRoute.data.subscribe(
      (response: any) => {
        this.resolvedArray = response;
      });
    this.baseModel = this.resolvedArray.customers[0];
    this.addFormValidations();
    this.baseModel.first_name = this.baseModel.profile.first_name;
    this.baseModel.last_name = this.baseModel.profile.last_name;
    this.baseModel.gender = this.baseModel.profile.gender;
    this.baseModel.dob = this.baseModel.profile.dob;
    this.baseModel.school = this.baseModel.profile.school;
    this.baseModel.type = this.baseModel.devices.length !== 0 ? this.baseModel.devices[this.baseModel.devices.length - 1].type : "";
    this.baseModel.ProfileImagePath = this.baseModel.profile_picture;
    this.baseModel.NationalCardFrontImagePath = this.baseModel.profile.national_card_front;
    this.baseModel.NationalCardBackImagePath = this.baseModel.profile.national_card_back;
    this.baseModel.referral_code = this.baseModel.referral_code == null ? 0 : this.baseModel.referral_code;

    this.setCustomerDetail(this.baseModel);
  }



  /**
   * the following method gets the category details from the resolver
   */
  setCustomerDetail(customer: BaseModel) {
    this.baseModel.active = customer.active === 1;
    this.formGroup.patchValue({
      ...this.baseModel
    });

    this.formGroup.updateValueAndValidity();
    this.formGroup.markAsTouched();
  }

  /**
 * The following method is used to add the form validations
 */
  addFormValidations(): void {
    const urlValidation: ValidatorFn[] = [Validators.required];
    this.addFormControlWithValidations("ambassador", [], false);
    this.addFormControlWithValidations("business_reference_id", [], true);
    this.addFormControlWithValidations("first_name", urlValidation, true);
    this.addFormControlWithValidations("last_name", [], true);
    this.addFormControlWithValidations("gender", urlValidation, true);
    this.addFormControlWithValidations("dob", urlValidation, true);
    this.addFormControlWithValidations("email", [], true);
    this.addFormControlWithValidations("promo_code", [], true);
    this.addFormControlWithValidations("points", [], true);
    this.addFormControlWithValidations("school", urlValidation, true);
    this.addFormControlWithValidations("type", [], true);
    this.addFormControlWithValidations("profile_picture",[],true);
    this.addFormControlWithValidations("national_card_front", [], true);
    this.addFormControlWithValidations("national_card_back", [], true);
    this.addFormControlWithValidations("referral_code", [], true);
    this.addFormControlWithValidations("status", [], true);
  }


  openImageDialog(nationalCardImageType: number | number) {

    const dialogRef = this.dialog.open(ImageCropDialogComponent, {
      width: this.constantList.POP_UP_DEFAULT_WIDTH,
      data: {
        file_size_error: english.data.TEXT.SIZE_ERROR,
        title: english.data.TEXT.POP_TITLE,
        sub_title: english.data.TEXT.POP_SUB_TITLE,
        file_size_limit: this.constantList.IDCARD_IMAGE_SIZE,
        aspect_ratio: this.constantList.BRAND_SECONDARY_IMAGE_TYPE === nationalCardImageType ?
          this.constantList.DEFAULT_IMAGE_PHOTO_ASPECT_RATIO : this.constantList.DEFAULT_COVER_PHOTO_ASPECT_RATIO
      }
    });

    // setting the observer for detecting popup close action
    dialogRef.afterClosed().subscribe(blob => {
      // only if the cropped image is selected
      if (blob && nationalCardImageType === this.constantList.PROFILE_IMAGE_TYPE) {
        const file: File = new File([blob], "filename.png");
        this.baseModel.ProfileImageDataURI = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
        this.baseModel.ProfileImagePath = null;
        this.baseModel.ProfileImage = file;
      }
      else if (blob && nationalCardImageType === this.constantList.NATIONAL_CARD_FRONT_IMAGE_TYPE) {
        const file: File = new File([blob], "filename.png");
        this.baseModel.NationalCardFrontImageDataURI = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
        this.baseModel.NationalCardFrontImagePath = null;
        this.baseModel.NationalCardFrontImage = file;
      }
      else if (blob && nationalCardImageType === this.constantList.NATIONAL_CARD_BACK_IMAGE_TYPE) {
        const file: File = new File([blob], "filename.png");
        this.baseModel.NationalCardBACKImageDataURI = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
        this.baseModel.NationalCardBackImagePath = null;
        this.baseModel.NationalCardBACKImage = file;
      }
    });

  }

  enableEditing() {
    if (!this.isUpdateUnabled) {
      this.formGroup.controls.first_name.enable();
      this.formGroup.controls.last_name.enable();
      this.formGroup.controls.gender.enable();
      this.formGroup.controls.dob.enable();
      this.formGroup.controls.school.enable();
      this.formGroup.controls.promo_code.enable();
      this.formGroup.controls.status.enable();

      this.isUpdateUnabled = true;
      this.translate.get("TEXT.DISABLE_EDITING").subscribe((res: string) => {
        this.labelEnablingButton = res;
      });
    }
    else {
      this.formGroup.controls.first_name.disable();
      this.formGroup.controls.last_name.disable();
      this.formGroup.controls.gender.disable();
      this.formGroup.controls.dob.disable();
      this.formGroup.controls.school.disable();
      this.formGroup.controls.promo_code.disable();
      this.isUpdateUnabled = false;
      this.translate.get("TEXT.ENABLE_EDITING").subscribe((res: string) => {
        this.labelEnablingButton = res;
      });
    }

  }

  /**
 * The following method is used to get validation messages.
 * @param {string} formElement
 * @returns {string}
 */
  getErrorMessage(formElement: string): string {
    // if any errors detected else ignore
    const control = this.formGroup.get(formElement);
    if (control != null && control.errors) {
      if (control.errors.required) {
        return english.data.INPUT.FIRST_NAME.REQUIRED_ERROR;
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
  * The following method is used to update customer status.
  * @param {number} status
  * 
  */
  updateCustomerStatus(status: number) {
    this._customerService.updateCustomerStatus(this.formGroup.get("business_reference_id").value, status)
      .subscribe((response: any) => {
        if (response) {
          if (response) {
            this.isSuccessful(<string>response.message, this.routeList.CUSTOMER_HOME);
          }
        }
      }, errorMessageArray => {
        this.isFailure(errorMessageArray);
      });
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
    this.setFormDataForSubmission()
      ._customerService.updateCustomer(this.formData)
      .subscribe((response: any) => {
        if (response) {
          if (response) {
            this.isSuccessful(<string>response.message, this.routeList.CUSTOMER_HOME);
          }
        }
      }, errorMessageArray => {
        this.isFailure(errorMessageArray);
      });
  }

  /**
 * The following method is used to set the formGroup data to the respective model instance
 * @returns {CategoryFormComponent}
 */
  setFormDataForSubmission() {
    this.formData = new FormData();
    const values = this.formGroup.getRawValue();
    this.formData.append("first_name", values.first_name);
    this.formData.append("last_name", values.last_name);
    this.formData.append("business_reference_id", values.business_reference_id);
    this.formData.append("school", values.school);
    this.formData.append("gender", values.gender);
    this.formData.append("dob", values.dob);
    this.formData.append("status", values.status);
    this.formData.append("promo_code", values.promo_code);
    this.formData.append("ambassador", values.ambassador ? "1" : "0");
    if (this.baseModel.ProfileImage) this.formData.append("profile_picture", this.baseModel.ProfileImage);
    if (this.baseModel.NationalCardFrontImage) this.formData.append("national_card_front", this.baseModel.NationalCardFrontImage);
    if (this.baseModel.NationalCardBACKImage) this.formData.append("national_card_back", this.baseModel.NationalCardBACKImage);
    this.formData.append("active", this.baseModel.active ? "1" : "0");
    return this;
  }



}
