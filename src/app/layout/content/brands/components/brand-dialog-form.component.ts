import {Component, Inject, Injector, OnInit, ViewChild} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {SkramblerFormBaseComponent} from "../../../../helpers/components/form-base.component";
import { locale as english } from "../i18n/en";
import {FormInterface} from "../../../../helpers/interfaces/form.interface";
import {ValidatorFn, Validators} from "@angular/forms";
import { NativeDateAdapter, DateAdapter, MatDatepicker } from "@angular/material";
import * as _moment from "moment";
import { default as _rollupMoment } from "moment";
import {BrandService} from "../services/brand.service";

const moment = _rollupMoment || _moment;

export class CustomDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    const formatString = "MMMM YYYY";
    return moment(date).format(formatString);
  }
}

@Component({
  selector: "skrambler-brand-dialog",
  templateUrl: "../templates/dialog-form.component.html",
  styleUrls: ["../styles/brand-form.component.scss"],
  providers: [
    {
      provide: DateAdapter, useClass: CustomDateAdapter
    }
  ]
})
export class BrandDialogFormComponent extends SkramblerFormBaseComponent implements OnInit, FormInterface {
  @ViewChild(MatDatepicker) picker;

  /**
   * The following object is used for get the dialog form data
   */
  public record: any;


  constructor(injector: Injector,
              public dialogRef: MatDialogRef<BrandDialogFormComponent>,
              private _brandService: BrandService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super(injector);
    this.translationLoader.loadTranslations(english);
    this.record = data ;
  }



  ngOnInit() {
    this.setPopupTitle();
    this.addFormValidations();
    this.setBrandData();
  }


  protected setPopupTitle(): void {
    // in POP UPP MODEL
    if (this.record.id) {
      this.translate.get("TEXT.EDIT_FEES_TITLE").subscribe((res: string) => {
        this.pageTitle = res;
      });
    }
  }

  /**
   * The following method is used to add the form validations
   */
  setBrandData(): void {
    if (this.data) {
      this.formGroup.patchValue({
        ...this.record
      });
      this.formGroup.updateValueAndValidity();
    }
  }

  /**
   * The following method is used to add the form validations
   */
  addFormValidations(): void {
    const emailValidation: ValidatorFn[] = [
      Validators.required,
      Validators.maxLength(50),
      Validators.email
    ];

    this.addFormControlWithValidations("email",  emailValidation);
    this.addFormControlWithValidations("date", [Validators.required]);
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
      ._brandService.sendInvoice(this.formData)
      .subscribe((response: any) => {
          if (response) {
            this.isSuccessful(<string>response.message);
            this.dialogRef.close(true);
          }
      }, errorMessageArray => {
        this.isFailure(errorMessageArray);
      });

  }

  /**
   * The following method is used to set the formGroup data to the respective model instance
   * @returns {ZoneFormComponent}
   */
  setFormDataForSubmission() {
    const values = this.formGroup.getRawValue();
    this.formData = new FormData();
    this.formData.append("email", values.email);
    this.formData.append("year_month", moment(values.date).format("YYYY-MM"));
    if (this.record.id) {
      this.formData.append("business_reference_id", this.record.id);
    }

    return this;
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
      } else if (this.formGroup.get(formElement).errors.email) {
        return english.data.INPUT.EMAIL.REQUIRED_ERROR;
      }
      else if (control.errors.maxlength) {
        return english.data.INPUT[formElement.toUpperCase()].REQUIRED_ERROR_LENGTH
          + control.errors.maxlength.requiredLength
          + " required";
      }
    } else {
      return "";
    }
  }

  /**
   * The following method is used to set the only month and year date
   */
  monthSelected(params) {
    this.formGroup.get("date").setValue(params);
    this.picker.close();
  }


}
