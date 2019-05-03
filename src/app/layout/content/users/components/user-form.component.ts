import { Component, Injector, OnInit, ViewChild } from "@angular/core";
import { ValidatorFn, Validators } from "@angular/forms";
import { locale as english } from "../i18n/en";
import { UserService } from "../services/user.service";
import { FormInterface } from "../../../../helpers/interfaces/form.interface";
import { SkramblerFormBaseComponent } from "../../../../helpers/components/form-base.component";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { Brand } from "../../brands/models/Brand";
import { PermissionService } from "../../../../helpers/services/permission.service";
import { BrandSearchComponent } from "app/helpers/components/brand-search/brand-search.component";
import { User } from "app/helpers/models/User";

@Component({
  selector: "skrambler-app-user-form",
  templateUrl: "../templates/form.component.html",
  styleUrls: ["../styles/users-list.component.scss"]
})
export class UserFormComponent extends SkramblerFormBaseComponent implements OnInit, FormInterface {


  /**
  * to monitor data retrieved from the resolver
  */
  private subscription$: Subscription;
  IsPassVisible = false;
  isUserRoleBrandOwner = false;

  pageTitle: string;

  user: User;

  /**
   * the following keeps the reference of the brand search input
   */
  @ViewChild(BrandSearchComponent) skramblerSearch: BrandSearchComponent;


  constructor(injector: Injector,
    private _activatedRoute: ActivatedRoute,
    private _userService: UserService, public _permissionService: PermissionService) {
    super(injector);
    this.translationLoader.loadTranslations(english);
    if (!_permissionService.isAdmin()) {
      this.goTo(this.routeList.DASHBOARD_HOME);
    }
    this.baseModel = new User();
    this.baseModel.active = true;
  }

  ngOnInit() {
    super.setPageTitle();
    this.addFormValidations();

    // resolving 
    this.subscription$ = this._activatedRoute.data.subscribe(
      (response: {
        data: User,
      }) => {
        // if user object is retrieved
        if (response.data) {
          this.setUserDetail(response.data[0]);
        }
      });

  }

  /**
 * The following method is used to add the form validations
 */
  addFormValidations(): void {
    const nameValidation: ValidatorFn[] = [
      Validators.required,
      Validators.maxLength(50)
    ];

    const emailValidation: ValidatorFn[] = [
      Validators.required,
      Validators.maxLength(50),
      Validators.email
    ];

    const passwordValidation: ValidatorFn[] = [
      Validators.maxLength(18),
      Validators.minLength(6),
    ];
    if (!this.isEditMode()) {
      passwordValidation.push(Validators.required);
    }



    this.addFormControlWithValidations("first_name", nameValidation);
    this.addFormControlWithValidations("last_name", nameValidation);
    this.addFormControlWithValidations("email", emailValidation);
    this.addFormControlWithValidations("user_password", passwordValidation);
    this.addFormControlWithValidations("user_role_id", passwordValidation);
  }

  /**
  * the following is called when the role is changed
  * @param selected 
  */
  onRoleChange(selected: any) {
    if (selected) {
      if (this._permissionService.IsBrandOwner(selected.value)) {
        this.isUserRoleBrandOwner = true;
      }
      else {
        this.isUserRoleBrandOwner = false;
        this.baseModel.brand.business_reference_id = null;
      }
      // emptying the brand search input if role is changed
      if (this.skramblerSearch && this.skramblerSearch.brand) this.skramblerSearch.brand.setValue("");
    }
  }

  /**
   * the following method is used to validate the selection of brand owner role, if any
   */
  validateBrandOwner() {
    if (this.isUserRoleBrandOwner) {
      if (!this.baseModel.brand.business_reference_id) return true;
      else return false;
    } else return false;
  }

  /*
  * The following method is used to catch changing status
  */
  changeStatus(event: any) {
    this.baseModel.active = event.checked;
  }


  /**
 * the following method gets the category details from the resolver
 */
  setUserDetail(user: User) {
    this.baseModel = new User(user);
    this.baseModel.active = user.status === 1;
    this.baseModel.user_role_id = user.roles[0].id;
    this.formGroup.patchValue({
      ...this.baseModel
    });
    this.baseModel.brand = new Brand(user.brand);

    this.formGroup.updateValueAndValidity();
    this.formGroup.markAsTouched();
    if (this._permissionService.IsBrandOwner(user.roles[0].id)) {
      this.isUserRoleBrandOwner = true;
    }
  }

  /**
* The following method is used to get validation messages.
* @param {string} formElement
* @returns {string}
*/
  getErrorMessage(formElement: string): string {

    const control = this.formGroup.get(formElement);
    if (control != null && control.errors) {
      if (control.errors.required) {
        return english.data.INPUT.FIRST_NAME.REQUIRED_ERROR;
      } else if (control.errors.maxlength) {
        return english.data.INPUT[formElement.toUpperCase()].REQUIRED_ERROR_LENGTH
          + control.errors.maxlength.requiredLength
          + " required";
      } else if (control.errors.minLength) {
        return english.data.INPUT[formElement.toUpperCase()].minLength
          + control.errors.minLength.requiredLength
          + " required";
      }
      else if (this.formGroup.get(formElement).errors.email) {
        return english.data.INPUT.EMAIL.REQUIRED_ERROR;
      }
      else if (control.errors.pattern) {
        return english.data.INPUT[formElement.toUpperCase()].PATTERN_ERROR;
      }
    } else {
      return "";
    }
  }

  /**
   * the following is called when the category is changed
   * @param selected 
   */
  onBrandChange(event: any) {
    if (event) {
      this.baseModel.brand = event.brand;
    } else {
      // this.baseModel.brand.business_reference_id = null;
      // // emptying the brand search input if role is changed
      // if (this.skramblerSearch.brand) this.skramblerSearch.brand.setValue("");
    }
  }

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
      ._userService.addUser(this.formData, this.baseModel.business_reference_id)
      .subscribe((response: any) => {
        if (response) {
          if (response) {
            this.isSuccessful(<string>response.message, this.routeList.USER_LISTING);
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
    if (this.baseModel.business_reference_id) this.formData.append("user_business_reference_id", this.baseModel.business_reference_id);
    this.formData.append("first_name", values.first_name.trim());
    this.formData.append("last_name", values.last_name.trim());
    this.formData.append("email", values.email.trim());
    if (values.user_password) {
      this.formData.append("user_password", values.user_password.trim());
    }

    this.formData.append("user_role_id", values.user_role_id);
    this.formData.append("status", this.baseModel.active ? "1" : "0");
    if (this.baseModel.brand.business_reference_id) {
      this.formData.append("brand_id", this.baseModel.brand.business_reference_id);
    }

    return this;
  }

}
