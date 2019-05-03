import {Component, Injector, OnInit} from "@angular/core";
import {FormBuilder, ValidatorFn, Validators} from "@angular/forms";
import {SkramblerAnimations} from "../../theme-core/animations";
import {SkramblerConfigService} from "../../theme-core/services/config.service";
import {FormInterface} from "../../helpers/interfaces/form.interface";
import {SkramblerFormBaseComponent} from "../../helpers/components/form-base.component";
import {locale as english} from "./i18n/en";

@Component({
  selector: "skrambler-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
  animations: SkramblerAnimations
})
export class SkramblerForgotPasswordComponent extends SkramblerFormBaseComponent implements OnInit, FormInterface {

  constructor(private fuseConfig: SkramblerConfigService,
              private formBuilder: FormBuilder,
              injector: Injector) {
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
    this.addFormValidations();
  }


  /**
   * The following method is used to add the form validations
   */
  addFormValidations(): void {
    const emailValidations: ValidatorFn[] = [Validators.required, Validators.email];

    this.addFormControlWithValidations("email", emailValidations);
  }

  /**
   * The following method is used to handle the submit action for the respective form
   */
  onSubmit(): void {

    if (this.formGroup.status === "VALID") {
      this.router.navigate(["dashboard"]).then();
    }
  }

  /**
   * The following method is used
   * @param {string} formElement
   * @returns {string}
   */
  getErrorMessage(formElement: string): string {
    // detect the required & email validation being passed on the respective form control
    if (this.formGroup.get(formElement).errors.email || this.formGroup.get(formElement).errors.required) {
      return english.data.INPUT.EMAIL.REQUIRED_ERROR;
    }
  }
}
