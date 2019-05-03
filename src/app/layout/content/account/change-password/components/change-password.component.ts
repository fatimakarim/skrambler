import {Component, Injector, OnInit} from "@angular/core";
import {ValidatorFn, Validators, AbstractControl} from "@angular/forms";
import {locale as english} from "../i18n/en";
import {FormInterface} from "../../../../../helpers/interfaces/form.interface";
import {SkramblerFormBaseComponent} from "../../../../../helpers/components/form-base.component";

@Component({
  selector: "skrambler-profile-reset-password",
  templateUrl: "../templates/form.component.html",
  styleUrls: ["../styles/change-password.component.scss"]
})
export class ProfileResetPasswordFormComponent extends SkramblerFormBaseComponent implements OnInit, FormInterface {
  public hidePass: boolean = true;
  public hideConfirmPass: boolean = true;
  public hideCurrentPass: boolean = true;

  constructor(injector: Injector) {
    super(injector);
    this.translationLoader.loadTranslations(english);
  }

  ngOnInit() {
    super.setPageTitle();
    this.addFormValidations();
  }

  /**
   * The following method is used to add the form validations
   */
  addFormValidations(): void {
    const password: ValidatorFn[] = [
      Validators.required,
      Validators.minLength(this.constantList.PASSWORD_MIN_LENGTH),
      Validators.maxLength(this.constantList.PASSWORD_MAX_LENGTH),
    ];

    const confirmPassword: ValidatorFn[] = [
      Validators.required,
      ProfileResetPasswordFormComponent.confirmPassword,
      Validators.minLength(this.constantList.PASSWORD_MIN_LENGTH),
      Validators.maxLength(this.constantList.PASSWORD_MAX_LENGTH),
    ];

    this.addFormControlWithValidations("password", confirmPassword);
    this.addFormControlWithValidations("current_password", password);
    this.addFormControlWithValidations("password_confirmation", confirmPassword);
  }

  /**
   * The following method is used to handle the submit action for the respective form
   */
  onSubmit(): void {
    if (this.formGroup.status === this.constantList.VALID_FORM_STATE) {
      this.formData = new FormData();
      const values = this.formGroup.getRawValue();
      this.formData.append("new_password" , values.password );
      this.formData.append("current_password" , values.current_password );
      this.formData.append("confirm_password" , values.password_confirmation );

      this.userService.updatePassword(this.formData)
        .subscribe((response: any) => {
          if (response.status === this.constantList.SUCCESS_STATUS) {
            this.goTo(this.routeList.DASHBOARD_HOME);
          }
        });
    }
  }

  /**
   * The following method is used
   * @param {string} formElement
   * @returns {string}
   */
  getErrorMessage(formElement: string): string {
    // if any errors detected else ignore
    if (this.formGroup.get(formElement).errors) {
      if (this.formGroup.get(formElement).errors.required) {
        return english.data.INPUT.GENERAL.REQUIRED_ERROR;
      } else if (this.formGroup.get(formElement).errors.minlength) {
        return english.data.INPUT.GENERAL.REQUIRED_MIN_LENGTH
          + this.formGroup.get(formElement).errors.minlength.requiredLength
          + " required";
      } else if (this.formGroup.get(formElement).errors.maxlength) {
        return english.data.INPUT.GENERAL.REQUIRED_MAX_LENGTH
          + this.formGroup.get(formElement).errors.maxlength.requiredLength
          + " required";
      } else if (this.formGroup.get(formElement).errors.pattern) {
        return english.data.INPUT.GENERAL.PATTERN_REQUIRED_ERROR;
      } else if (formElement === "password_confirmation"
        && this.formGroup.get(formElement).errors.passwordsNotMatch) {
        return english.data.INPUT.PASSWORD_CONFIRMATION.MATCH_ERROR;
      } else if ((formElement === "password_confirmation" || formElement === "password")
        && this.formGroup.get(formElement).errors.passwordsNotMatch) {
        return english.data.INPUT.PASSWORD_CONFIRMATION.MATCH_ERROR;
      }

      return "";
    }
  }

  static confirmPassword(control: AbstractControl) {
    if (!control.parent || !control) {
      return;
    }

    const password = control.parent.get("password");
    const passwordConfirm = control.parent.get("password_confirmation");
    if (!password || !passwordConfirm) {
      return;
    } else if (!passwordConfirm.value) {
      return;
    } else if (password.value !== passwordConfirm.value) {
      return {
        passwordsNotMatch: true
      };
    } else {
      passwordConfirm.setErrors(null);
      return;
    }
  }
}
