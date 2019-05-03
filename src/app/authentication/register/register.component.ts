import {Component, Injector, OnInit} from "@angular/core";
import {FormBuilder, ValidatorFn, Validators} from "@angular/forms";
import {SkramblerAnimations} from "../../theme-core/animations";
import {SkramblerConfigService} from "../../theme-core/services/config.service";
import {FormInterface} from "../../helpers/interfaces/form.interface";
import {SkramblerFormBaseComponent} from "../../helpers/components/form-base.component";
import {locale as english} from "./i18n/en";

@Component({
  selector: "skrambler-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  animations: SkramblerAnimations
})
export class SkramblerRegisterComponent extends SkramblerFormBaseComponent implements OnInit, FormInterface {

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
    const password: ValidatorFn[] = [Validators.required, Validators.minLength(this.constantList.PASSWORD_MIN_LENGTH)];

    this.addFormControlWithValidations("first_name", [Validators.required]);
    this.addFormControlWithValidations("last_name", [Validators.required]);
    this.addFormControlWithValidations("email", emailValidations);
    this.addFormControlWithValidations("password", password);
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
    // detect the minLength validation being passed on the respective form control
    if (this.formGroup.get(formElement).errors.minlength) {
      return english.data.INPUT.PASSWORD.REQUIRED_ERROR + this.formGroup.get(formElement).errors.minlength.requiredLength;
    }
    // detect the required & email validation being passed on the respective form control
    else if (this.formGroup.get(formElement).errors.email && this.formGroup.get(formElement).errors.required) {
      return english.data.INPUT.EMAIL.REQUIRED_ERROR;
    } else if (this.formGroup.get(formElement).errors.required) {
      return english.data.INPUT[formElement.toUpperCase()].REQUIRED_ERROR;
    }
  }
}
