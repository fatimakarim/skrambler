import { Component, Injector, OnInit } from "@angular/core";
import { ValidatorFn, Validators } from "@angular/forms";

import { MatDialog } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";

import { locale as english } from "../i18n/en";
import { Category } from "../models/Category";
import { CategoryService } from "../services/category.service";
import { FormInterface } from "../../../../helpers/interfaces/form.interface";
import { SkramblerFormBaseComponent } from "../../../../helpers/components/form-base.component";
import { ImageCropDialogComponent } from "../../../../helpers/components/image-cropper/image-crop-dialog.component";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { PermissionService } from "../../../../helpers/services/permission.service";

@Component({
  selector: "skrambler-category-form",
  templateUrl: "../templates/form.component.html",
  styleUrls: ["../styles/category-form.component.scss"],
})
export class CategoryFormComponent extends SkramblerFormBaseComponent implements OnInit, FormInterface {

  /**
 * to monitor data retrieved from the resolver
 */
  private subscription$: Subscription;

  /**
   * the following holds the list of categories
   */
  public parentCategories: Category[] = [];


  private selectedCategoryId: string | number;
  constructor(injector: Injector,
    private _activatedRoute: ActivatedRoute,
    private _categoryService: CategoryService,
    private dialog: MatDialog, public _permissionService: PermissionService) {
    super(injector);
    if (!this._permissionService.isAdmin()){
      this.goTo(this.routeList.DASHBOARD_HOME);
     }
    this.translationLoader.loadTranslations(english);

    this.baseModel = new Category();
    this.baseModel.active = true;
  }

  ngOnInit() {
    super.setPageTitle();
    this.addFormValidations();
    // resolving the categories dropdown
    this.subscription$ = this._activatedRoute.data.subscribe(
      (response: {
        data: {
          categories: Category[],
          category: Category,
        },
      }) => {
        this.parentCategories = response.data.categories;
        // if category object is retrieved
        if (response.data.category) {
          this.setCategoryDetail(response.data.category);
        }
      });
  }

  /**
   * the following method gets the category details from the resolver
   */
  setCategoryDetail(category: Category) {
    this.baseModel = new Category(category);
    this.baseModel.active = category.active === 1;

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
    const nameValidation: ValidatorFn[] = [
      Validators.required,
      Validators.maxLength(40)
    ];

    this.addFormControlWithValidations("name", nameValidation);
    this.addFormControlWithValidations("category_id", [Validators.required]);
  }

  /**
 * the following is called when the category is changed
 * @param selected 
 */
  onCategoryChange(selected: any) {
    if (selected) {
      this.baseModel.category_id = selected.value;
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
    this.setFormDataForSubmission()
      ._categoryService.addCategory(this.formData, this.baseModel.id)
      .subscribe((response: any) => {
        if (response) {
          if (response) {
            this.isSuccessful(<string>response.message, this.routeList.CATEGORY_LISTING);
          }
        }
      }, errorMessageArray => {
        this.isFailure(errorMessageArray);
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
    this.formData = new FormData();
    const values = this.formGroup.getRawValue();
    this.formData.append("name", values.name);
    this.formData.append("category_id", values.category_id);
    this.formData.append("active", this.baseModel.active ? "1" : "0");
    if (this.baseModel.id) { this.formData.append("id", this.baseModel.id); }

    return this;
  }

  /*
   * The following method is used to catch changing status
   */
  changeStatus(event: any) {
    this.baseModel.active = event.checked;
  }
}
