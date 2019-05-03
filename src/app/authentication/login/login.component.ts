import { Component, Injector, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { SkramblerAnimations } from "../../theme-core/animations";
import { SkramblerConfigService } from "../../theme-core/services/config.service";
import { FormInterface } from "../../helpers/interfaces/form.interface";
import { SkramblerFormBaseComponent } from "../../helpers/components/form-base.component";
import { locale as english } from "./i18n/en";
import { Observable } from "../../../../node_modules/rxjs";
import { passValidator } from "../login/custom-validatior";
import { CookieService } from "ngx-cookie-service";
import * as CryptoJS from "crypto-js";
import { HttpResponse } from "@angular/common/http";
import { SkramblerNavigationService } from "../../theme-core/components/navigation/navigation.service";

@Component({
  selector: "skrambler-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  animations: SkramblerAnimations
})
export class SkramblerLoginComponent extends SkramblerFormBaseComponent implements OnInit, FormInterface {
  IsRememberCoockieExists = false;
  IsPassVisible = false;
  IsChecked = false;
  /*
    email user for the reset password
   */
  public emailResetPassword = "";
  /**
   * To check whether to show the forgot password form or not
   * @type {boolean}
   */
  public showLoginForm = true;
  /**
   * To check whether to show the forgot password form or not
   * @type {boolean}
   */
  public showForgotForm = false;
  /**
   * To check whether to show the resset password form or not
   * @type {boolean}
   */
  public showRessetForm = false;
  /**
   * The form group for the forgot password form
   * @type {FormGroup}
   */
  public passwordFormGroup: FormGroup = new FormGroup({});

  /**
   * The form group for the resset password form
   * @type {FormGroup}
   */
  public ressetPasswordFormGroup: FormGroup = new FormGroup({});



  constructor(private fuseConfig: SkramblerConfigService,
    private formBuilder: FormBuilder, private cookieService: CookieService,
    injector: Injector, private _skramblerNavigationService: SkramblerNavigationService) {
    super(injector);
    this.translationLoader.loadTranslations(english);
    this.fuseConfig.setSettings({
      layout: {
        navigation: "none",
        toolbar: "none",
        footer: "none"
      }
    });

  }

  ngOnInit() {
    if (this.cookieService.get("remember")) {
      this.IsRememberCoockieExists = true;
      this.IsChecked = true;
    }
    this.addFormValidations();
    if (this.route.snapshot.params["email"]) {
      this.showForgotForm = false;
      this.showLoginForm = false;
      this.showRessetForm = true;
      this.emailResetPassword = this.route.snapshot.params["email"];
      this.ressetPasswordFormGroup.controls["email"].setValue(this.emailResetPassword);
      this.ressetPasswordFormGroup.controls["email"].disable();
    }
    this.updateConfirmPasswordValidity();


    if (this.IsRememberCoockieExists) {
      this.formGroup.controls["email"].setValue(CryptoJS.AES.decrypt(
        this.cookieService.get("email").toString(),
        this.constantList.DEFAULT_COOKIE_ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8));
      this.formGroup.controls["password"].setValue(CryptoJS.AES.decrypt(
        this.cookieService.get("password").toString(),
        this.constantList.DEFAULT_COOKIE_ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8));
    }
  }


  /**
   * The following method is used to add the form validations
   */
  addFormValidations(): void {
    const emailValidations: ValidatorFn[] = [Validators.required, Validators.email];
    const password: ValidatorFn[] = [Validators.required, Validators.minLength(this.constantList.PASSWORD_MIN_LENGTH)];
    const requiredValidation: ValidatorFn[] = [Validators.required];
    const matchPassword: ValidatorFn[] = [Validators.required, passValidator];

    // adding validations to the login form
    this.addFormControlWithValidations("email", emailValidations);
    this.addFormControlWithValidations("password", password);
    this.addFormControlWithValidations("remember_me", [], false, this.formGroup, this.IsChecked ? true : false);

    // Adding forgot password email validation
    this.passwordFormGroup.addControl("email", new FormControl("", emailValidations));

    // Adding resset password form validation
    this.ressetPasswordFormGroup.addControl("email", new FormControl("", null));
    this.ressetPasswordFormGroup.addControl("new_password", new FormControl("", password));
    this.ressetPasswordFormGroup.addControl("confirm_password", new FormControl("", matchPassword));
    this.ressetPasswordFormGroup.addControl("code", new FormControl("", requiredValidation));
  }

  /**
   * The following method is used to handle the submit action for the respective form
   */
  onSubmit(): void {
    if (this.formGroup.status === this.constantList.VALID_FORM_STATE) {
      const body = {
        email: this.formGroup.value.email,
        password: this.formGroup.value.password
      };
      // this.userService.rememberMe = this.formGroup.value.remember_me;
      this.userService.login(body, this.formGroup.value.remember_me).subscribe((result: any) => {
        if (result) {
          this.sharedDataService.changeFormSubmitStatus(false);
          this._skramblerNavigationService.updateNavigationModel();
          this.isSuccessful(result.message, this.routeList.DASHBOARD_HOME, 0);
        }
      }, rejectMessage => {
        this.translate.get("TEXT.WRONG_CREDENTIALS").subscribe((res: string) => {
          this.isFailure([res]);
        });
      });
    }
  }

  /**
   * The following method is used
   * @param {string} formElement
   * @returns {string}
   */
  getErrorMessage(formElement: string): string {
    // check if any error exists or not
    if (this.formGroup.get(formElement).errors) {
      // detect the minLength validation being passed on the respective form control i.e. password in this case
      if (this.formGroup.get(formElement).errors.minlength) {
        return english.data.INPUT.PASSWORD.REQUIRED_ERROR_LENGTH + this.formGroup.get(formElement).errors.minlength.requiredLength;
      }
      // detect the required & email validation being passed on the respective form control i.e. email in this case
      if (this.formGroup.get(formElement).errors.email ||
        (this.formGroup.get(formElement).errors.email && this.formGroup.get(formElement).errors.required)) {
        return english.data.INPUT.EMAIL.REQUIRED_ERROR;
      }
      // detect the required validation being passed on the respective form control i.e. password in this case
      if (this.formGroup.get(formElement).errors.required) {
        return english.data.INPUT.PASSWORD.REQUIRED_ERROR;
      }
    }
  }

  getEmailErrorMessage(formElement: string): string {
    // detect the required & email validation being passed on the respective form control i.e. email in this case
    // if (this.formGroup.get(formElement).errors.email ||
    //   (this.formGroup.get(formElement).errors.email && this.formGroup.get(formElement).errors.required)) {
    return english.data.INPUT.EMAIL.REQUIRED_ERROR;
    // }
  }

  // used to get message for reset form validation
  getResetFormErrorMessage(formElement: string): string {
    if (formElement === "confirm_password") {
      return english.data.INPUT.CONFIRM_PASSWORD.MATCH_PASSWORD_ERROR;
    }
    else if (this.ressetPasswordFormGroup.get(formElement).errors) {
      // detect the minLength validation being passed on the respective form control i.e. password in this case
      if (this.ressetPasswordFormGroup.get(formElement).errors.minlength) {
        return english.data.INPUT.PASSWORD.REQUIRED_ERROR_LENGTH + this.ressetPasswordFormGroup.get(formElement).errors.minlength.requiredLength;
      }
      // detect the required & email validation being passed on the respective form control i.e. email in this case
      if (this.ressetPasswordFormGroup.get(formElement).errors.email ||
        (this.ressetPasswordFormGroup.get(formElement).errors.email && this.ressetPasswordFormGroup.get(formElement).errors.required)) {
        return english.data.INPUT.EMAIL.REQUIRED_ERROR;
      }
      // detect the required validation being passed on the respective form control i.e. password in this case
      if (this.ressetPasswordFormGroup.get(formElement).errors.required) {
        return english.data.INPUT.PASSWORD.REQUIRED_ERROR;
      }
    }
  }

  // trigger confirm_password validation while changing password field value.
  updateConfirmPasswordValidity(): void {
    this.ressetPasswordFormGroup.controls.new_password.valueChanges
      .subscribe(
        x => this.ressetPasswordFormGroup.controls.confirm_password.updateValueAndValidity()
      );
  }

  /**
   * The following method is used to handle the action on the forgot password action
   */
  forgotPasswordClicked() {
    this.showForgotForm = true;
    this.showLoginForm = false;
  }

  /**
   * The following method is used to handle the action on the go back from password action
   */
  goBackFromForgotPasswordClicked() {
    this.showForgotForm = false;
    this.showLoginForm = true;
  }

  /**
 * The following method is used to handle the submit action for forget password
 */
  onSubmitForgetPass(): void {
    if (this.passwordFormGroup.status === this.constantList.VALID_FORM_STATE) {
      this.userService.postForgotPasswordRequest(this.passwordFormGroup.value.email).then(result => {
        if (result) {
          for (const field in result) {
            if (field === "message") {
              this.translate.get("TEXT.FORGOT_PASSWORD_EMAIL_NOTIFICATION_SUCCESS").subscribe((res: string) => {
                this.isSuccessful(res);
              });
            }
          }
          // show the login form back after showing the respective success message
          Observable.timer(this.constantList.DEFAULT_REDIRECTION_WAIT_TIME)
          .subscribe(() => {
            this.emailResetPassword = this.passwordFormGroup.value.email;
            this.ressetPasswordFormGroup.controls["email"].setValue(this.emailResetPassword);
            this.ressetPasswordFormGroup.controls["email"].disable();
            this.showForgotForm = false;
            this.showRessetForm = true;
          });
        }
      }, errorMessageArray => {
        this.isFailure(errorMessageArray);
      }).catch(errorMessage => {

      });
    }
  }

  /**
 * The following method is used to handle the submit action for resset password
 */
  onSubmitResetPass(): void {
    this.ressetPasswordFormGroup.controls["email"].setValue(this.emailResetPassword);
    this.ressetPasswordFormGroup.controls["email"].disable();
    if (this.ressetPasswordFormGroup.status === this.constantList.VALID_FORM_STATE) {

      this.userService.resetPassword({
        email: this.emailResetPassword, code: this.ressetPasswordFormGroup.value.code
        , password: this.ressetPasswordFormGroup.value.new_password
      }).then(result => {
        if (result) {
          this.isSuccessful();
          for (const field in result) {
            if (field === "message") {
              this.isSuccessful(result[field]);
              // show the login form back after showing the respective success message
              Observable.timer(this.constantList.DEFAULT_REDIRECTION_WAIT_TIME)
                .subscribe(() => {
                  this.router.navigate(["auth/login"]).then();
                  this.showForgotForm = false;
                  this.showRessetForm = false;
                  this.showLoginForm = true;
                });
            }
          }
        }
      }, errorMessageArray => {
        this.translate.get("TEXT.CODE_WRONG_EXPIRED").subscribe((errorMessage: string) => {
          this.isFailure([errorMessage]);
        });
      }).catch(errorMessage => {

      });
    }
  }

}
