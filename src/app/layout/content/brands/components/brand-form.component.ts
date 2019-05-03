import { Component, Injector, OnInit } from "@angular/core";
import { ValidatorFn, Validators } from "@angular/forms";

import { MatDialog, MatAutocompleteSelectedEvent } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";

import { locale as english } from "../i18n/en";
import { Brand } from "../models/Brand";
import { BrandService } from "../services/brand.service";
import { FormInterface } from "../../../../helpers/interfaces/form.interface";
import { SkramblerFormBaseComponent } from "../../../../helpers/components/form-base.component";
import { ImageCropDialogComponent } from "../../../../helpers/components/image-cropper/image-crop-dialog.component";
import { Subscription, from } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { Category } from "../../categories/models/Category";
import { Observable } from "rxjs";
import { map, startWith, debounceTime, distinctUntilChanged, switchMap, skip } from "rxjs/operators";
import "rxjs/add/operator/filter";
import { CategoryService } from "../../categories/services/category.service";
@Component({
  selector: "skrambler-brand-form",
  templateUrl: "../templates/form.component.html",
  styleUrls: ["../styles/brand-form.component.scss"],
})
export class BrandFormComponent extends SkramblerFormBaseComponent implements OnInit, FormInterface {

  /**
 * to monitor data retrieved from the resolver
 */
  private subscription$: Subscription;

  /**
   * the following holds the list of categories
   */
  public parentCategories: Category[] = [];


  /**
   * the following holds the filtered tags based on user entered query
   */
  public filteredTags: Observable<any[]>;

  /**
   * the following holds the filtered sub-categories based on the user enetred query
   */
  public filteredSubCategories: Observable<any[]>;

  /**
   * the following holds the complete tags list coming from the respective resolver
   */
  private tags: any[] = [];

  /**
   * the following holds the sub-categories coming from the respective API 
   */
  public subCategories: any[] = [];

  /**
   * the following holds the tags chips list i.e. the selected list of the tags by the user
   */
  public tagsChipList: any[] = [];

  /**
   * the following holds the sub-categories chips list i.e. the selected list of the sub-categoris by the user
   */
  public subCategoriesChipList: any[] = [];

  /**
   * array of photos album files
   * @type {any[]}
   */
  photosAlbum: any = [];
  /**
   * array of photos album as dataURI or Image URL
   * @type {any[]}
   */
  photosAlbumData: any = [];

  /**
 * array of album photo ids that are deleted by the user
 * @type {any[]}
 */
  deleteAlbumPhotosId: any = [];


  private selectedCategoryId: string | number;
  constructor(injector: Injector,
    private _activatedRoute: ActivatedRoute,
    private _categoryService: CategoryService,
    private _brandService: BrandService,
    private dialog: MatDialog) {
    super(injector);
    // this.canAccessModule("categories");
    this.translationLoader.loadTranslations(english);
    this.baseModel = new Brand();
    this.baseModel.active = 1;
  }

  ngOnInit() {
    super.setPageTitle();
    this.addFormValidations();
    // resolving the categories dropdown
    this.subscription$ = this._activatedRoute.data.subscribe(
      (response: {
        categories?: { categories: Category[] },
        tags: any[]
        brand?: { categories: Category[], brand: Brand }
      }) => {
        this.parentCategories = response.categories ? response.categories.categories : response.brand.categories;
        if (response.brand) {
          this.setupBrandDetails(response.brand.brand);
         
        }
      });
    // the following setups the observable for tags
    this.filteredTags = this.formGroup.get("tags").valueChanges
      .pipe(
        startWith(""),
        map(value => this.filter(this.tags, value)),
      );

    // the following setups the obervable for sub-category selection
    this.filteredSubCategories = this.formGroup.controls.sub_categories.valueChanges
      .pipe(
        skip(1),
        startWith(""),
        debounceTime(this.constantList.DEFAULT_DEBOUNCE_TIME),
        distinctUntilChanged(),
        switchMap(val => {
          return this.filterSubCategories(val);
        })
      );
  }

    /**
   * the following method checks whether to enable or disable sub-category fields based on already selected
   */
  private updateSubCategoryDropDownState(){
    if (this.subCategoriesChipList.length === 3) this.formGroup.get("sub_categories").disable();
    else this.formGroup.get("sub_categories").enable();
  }

  /**
   * the following method checks whether to enable or disable tags fields based on already selected
   */
  private updateTagsDropDownState(){
    if (this.tagsChipList.length === 4) this.formGroup.get("tags").disable();
    else this.formGroup.get("tags").enable();
  }

  /**
   * the following is used to setup the brand details
   * @param brandData 
   */
  private setupBrandDetails(brandData: any) {
    // directly mapping the properties that matches the proerpties name of the brand model
    this.baseModel.mapValues(brandData);
    this.formGroup.patchValue({
      ...this.baseModel,
    });
    // iterating and entering sub-categories for the front-end
    Observable.from(this.baseModel.brand_sub_categories).subscribe(
      (record: { sub_category: Category }) => {
        return this.subCategoriesChipList.push(record.sub_category);
      }
    );
    // iterating and entering tags for the front-end
    Observable.from(this.baseModel.brand_tags).subscribe(
      (record: { tag: any }) => {
        return this.tagsChipList.push(record.tag);
      }
    );
    this.baseModel.logoImagePath = brandData.logo;
    this.baseModel.mainImagePath = brandData.image;
    this.photosAlbumData = this.baseModel.photos ? this.baseModel.photos : [];
    this.formGroup.get("sub_categories").enable();
    this.tags = this.baseModel.category.tags;

    // Fetching delivery type description
    // Fetching delivery type description

    if (this.baseModel.brand_delivery_types && this.baseModel.brand_delivery_types.length >= 1) {
      const selectDeliveryList = this.constantList.DELIVERY_TYPES.filter(d => this.baseModel.brand_delivery_types.find(d2 => d.delivery_type_id === d2.delivery_type_id))
      this.formGroup.get("delivery_type").setValue(selectDeliveryList);
      this.baseModel.brand_delivery_types.forEach((delivery, index) => {
        this.addDeliveryDescription(delivery.delivery_type_id, delivery);
      });
    }

    // this.setSubCategoryValidation();
  }

  /**
   * the following method is used to filter sub-categories
   * @param val 
   */
  private filterSubCategories(val: string) {
    if (val) {
      return this._categoryService.getSubCategoriesForParentCategory(this.baseModel.category_id, val).pipe(
        map(response => {
          this.subCategories = response;
          return this.subCategories;
        })
      );
    } else return [];
  }
  /**
 * the following method is used to filter questions
 */
  private filter(array: any[], value: string): any[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return array.filter(obj => obj.name.toLowerCase().includes(filterValue));
    } else return [];
  }


  /**
   *  the following method is used to remove respective tage form the chip list
   * @param tag 
   */
  removeTagChip(tag: any) {
    this.tagsChipList = this.tagsChipList.filter(item => item !== tag);
    this.updateTagsDropDownState();
  }
  /**
   * the following method is used to remove sub-category tags from the chip list
   * @param tag 
   */
  removeSubCategoryChip(tag: any) {
    this.subCategoriesChipList = this.subCategoriesChipList.filter(item => item !== tag);
    this.updateSubCategoryDropDownState();
    this.setSubCategoryValidation();
  }

  /**
   * the following method detects tag selection
   * @param selected 
   */
  onTagSelected(selected: MatAutocompleteSelectedEvent) {
    const selectedTag = this.tags.filter((t: any) =>
      t.name.toLowerCase().indexOf(selected.option.value.toLowerCase()) === 0)[0];
    this.formGroup.get("tags").setValue("");
    // check if selected branch exists or not
    let doesTagExist = false;
    from(this.tagsChipList).find((v: any) => v.name === selectedTag.name).subscribe(response => {
      // if response found that means
      if (response) doesTagExist = true;
    }, err => { }, () => {
      if (!doesTagExist) this.tagsChipList.push(selectedTag);
      this.updateTagsDropDownState();
    });
  }

  /**
   * the following method detects sub-category selection
   * @param selected 
   */
  onSubCategorySelected(selected: MatAutocompleteSelectedEvent) {

    const selectedSubCategory = this.subCategories.filter((t: any) =>
      t.name.toLowerCase().indexOf(selected.option.value.toLowerCase()) === 0)[0];
    this.formGroup.get("sub_categories").setValue("");
    // check if selected branch exists or not
    let doesCategoryExist = false;
    from(this.subCategoriesChipList).find((v: any) => v.name === selectedSubCategory.name).subscribe(response => {
      // if response found that means
      if (response) doesCategoryExist = true;
    }, err => { }, () => {
      if (!doesCategoryExist) this.subCategoriesChipList.push(selectedSubCategory);
      this.updateSubCategoryDropDownState();
    });
   this.setSubCategoryValidation();
  }

   /**
   * the following method is used to set validation of sub category.
   */
private setSubCategoryValidation(){
  if(this.subCategoriesChipList.length==0){
    this.formGroup.get("sub_categories").setValidators([Validators.required]);
    this.formGroup.get("sub_categories").setValue(null);
  }
  else{
    this.formGroup.get("sub_categories").setValidators([]);  
    this.formGroup.get("sub_categories").setValue('');
  }
  this.formGroup.get("sub_categories").updateValueAndValidity();
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

  openImageDialog(brandImageType: number | number) {

    const dialogRef = this.dialog.open(ImageCropDialogComponent, {
      width: this.constantList.POP_UP_DEFAULT_WIDTH,
      data: {
        file_size_error: english.data.TEXT.SIZE_ERROR,
        title: english.data.TEXT.POP_TITLE,
        sub_title: english.data.TEXT.POP_SUB_TITLE,
        file_size_limit: this.constantList.BRAND_IMAGE_SIZE,
        aspect_ratio: this.constantList.BRAND_SECONDARY_IMAGE_TYPE === brandImageType ?
          this.constantList.DEFAULT_IMAGE_PHOTO_ASPECT_RATIO : this.constantList.DEFAULT_COVER_PHOTO_ASPECT_RATIO
      }
    });

    // setting the observer for detecting popup close action
    dialogRef.afterClosed().subscribe(blob => {
      // only if the cropped image is selected
      if (blob && brandImageType === this.constantList.BRAND_MAIN_IMAGE_TYPE) {
        const file: File = new File([blob], "filename.png");
        this.baseModel.mainImageDataURI = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
        this.baseModel.mainImagePath = null;
        this.baseModel.mainImage = file;
      }
      else if (blob && brandImageType === this.constantList.BRAND_LOGO_IMAGE_TYPE) {
        const file: File = new File([blob], "filename.png");
        this.baseModel.logoImageDataURI = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
        this.baseModel.logoImagePath = null;
        this.baseModel.logoImage = file;
      }
      else if (blob && brandImageType === this.constantList.BRAND_SECONDARY_IMAGE_TYPE) {

        // first check if not more than 10 images are already uploaded
        if (this.photosAlbumData.length < this.constantList.DEFAULT_PHOTO_ALBUM_LENGTH) {
          const file: File = new File([blob], "filename.png");
          // to make sure images more than 5MB are not added
          this.photosAlbum.push(file);
          // sending the index on which the respective file is stored in the photosAlbum array
          this.photosAlbumData.push({ id: this.photosAlbum.length - 1, image: this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob)), imageFile: file });

        } else this.translate.get("INPUT.ALBUM_PHOTO.IMAGE_NUMBER_ERROR").subscribe((res: string) => {
          this.showSnackBarWithMessage(res);
        });
      }
    });
  }

  /**
  * the following method is used to remove images from both arrays
  * @param {number} index
  * @param uploadedFileImage
  */
  removeImage(index: number, uploadedFileImage: any) {

    // to make sure the form is not disabled
    if (!this.formGroup.disabled) {
      // if edit mode, check if the image delete exists in the previously uploaded photos, if not then follow normal flow
      if (this.baseModel.photos) {
        const matchedIndex = this.baseModel.photos.findIndex(imageObject => imageObject.image === uploadedFileImage.image);
        if (matchedIndex > -1) {
          // find the matching index for the respected Image File data
          const deletedPhotoObject: any = this.baseModel.photos[matchedIndex];
          this.deleteAlbumPhotosId.push(deletedPhotoObject.id);
        }
      }

      // first checking if the image being removed is the image uploaded by the user through the UI
      if (uploadedFileImage.imageFile) {
        // now check if we find a matched index for the file being removed
        const fileMatchedIndex = this.photosAlbum.findIndex(imageObject => imageObject === uploadedFileImage.imageFile);
        if (fileMatchedIndex > -1) this.photosAlbum.splice(fileMatchedIndex, 1);
      }
      // remove it from the front-end rendered array of images
      this.photosAlbumData.splice(index, 1);
    }
  }

  /**
   * The following method is used to add the form validations
   */
  addFormValidations(): void {
    const nameValidation: ValidatorFn[] = [
      Validators.required,
      Validators.maxLength(40)
    ];
    const urlValidation: ValidatorFn[] = [
    Validators.pattern(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)];

    const urlReqValidation: ValidatorFn[] = [
      Validators.pattern(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)];

    this.addFormControlWithValidations("sub_categories", [], !this.baseModel.category_id);
    this.addFormControlWithValidations("name", nameValidation);
    this.addFormControlWithValidations("category_id", [Validators.required]);
    this.addFormControlWithValidations("description", [Validators.required]);
    this.addFormControlWithValidations("tags", []);
    this.addFormControlWithValidations("facebook_page", urlValidation);
    this.addFormControlWithValidations("insta_page", urlValidation);
    this.addFormControlWithValidations("twitter_page", urlValidation);
    this.addFormControlWithValidations("website", urlReqValidation);
    this.addFormControlWithValidations("delivery_type", [] );
  }

  /**
   * THe following method is used to get the offer delivery types
   * @param event
   */

  onTypeChange(event: any){
    if (event) {
      this.baseModel.brand_delivery_types = event.value;
      this.baseModel.brand_delivery_types.forEach( value => {
        this.addDeliveryDescription(value.delivery_type_id , value);
      });
    }

  }

  /**
   * The following method is used to add th delivery types of description
   * @param value
   */
  addDeliveryDescription(index: number , value?: any): void {
    const descriptionValidation: ValidatorFn[] = [
      Validators.required,
      Validators.maxLength(200),
    ];
    const notesControlName = `description_${index}`;

    this.addFormControlWithValidations(notesControlName, descriptionValidation);
    if (value && value.description) {
      this.formGroup.get(notesControlName).patchValue(value.description);
      this.formGroup.get(notesControlName).updateValueAndValidity({ onlySelf: true });
      this.formGroup.get(notesControlName).markAsTouched({ onlySelf: true });
    }
    // this.baseModel.delivery_types[index] = value;

  }

  /**
 * the following is called when the category is changed
 * @param selected 
 */
  onCategoryChange(selected: any) {
    if (selected) {
      this.baseModel.category_id = selected.value;
      this.formGroup.get("sub_categories").enable();
      this.subCategories = [];
      this.tagsChipList = [];
      this.subCategoriesChipList = [];
      const selectedCategory = this.parentCategories.filter((category: Category) =>
      category.id.toString().indexOf(selected.value.toString()) === 0)[0];
      this.tags = selectedCategory.tags;
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
        this._brandService.addBrand(this.formData, this.baseModel.business_reference_id)
          .subscribe((response: any) => {
            if (response) {
              if (response) {
                this.isSuccessful(<string>response.message, this.routeList.BRAND_LISTING);
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
      this.formData.append("name", values.name);
      this.formData.append("active", this.baseModel.active ? "1" : "0" );
      this.formData.append("category_id", values.category_id);
      if ( values.website !== undefined)   this.formData.append("website", values.website);
      if ( values.facebook_page !== undefined) this.formData.append("facebook_page", values.facebook_page);
      if (values.insta_page !== undefined) this.formData.append("insta_page", values.insta_page);
      if (values.twitter_page !== undefined) this.formData.append("twitter_page", values.twitter_page);
      this.formData.append("description", values.description);
      if (this.baseModel.logoImage) this.formData.append("logo", this.baseModel.logoImage);
      if (this.baseModel.mainImage) this.formData.append("image", this.baseModel.mainImage);

      // Adding delivery type notes.
      this.baseModel.brand_delivery_types.forEach((delivery, index) => {
        if (delivery.delivery_type_id) {
          this.formData.append(`delivery_types[${index}][delivery_type_id]`, delivery.delivery_type_id);
        }
        this.formData.append(`delivery_types[${index}][description]`, `${values[["description", delivery.delivery_type_id].join("_")]}`);
      });

      // Adding BRAND photo albums
      Observable.range(0, this.photosAlbum.length).subscribe((x) => {
        this.formData.append("brand_images[]", this.photosAlbum[x]);
      }, error => {
        reject(error);
      }, () => {
        // Adding Tags
        Observable.range(0, this.tagsChipList.length).subscribe((x) => {
          this.formData.append("tags[]", this.tagsChipList[x].id);
        }, error => {
          reject(error);
        }, () => {
          // Adding Subcategories
          Observable.range(0, this.subCategoriesChipList.length).subscribe((x) => {
            this.formData.append("sub_category_id[]", this.subCategoriesChipList[x].id);
          }, error => {
            reject(error);
          }, () => {
            // Adding Deleted Photos if any
            Observable.range(0, this.deleteAlbumPhotosId.length).subscribe((x) => {
              this.formData.append("deleted_brand_photo_id[]", this.deleteAlbumPhotosId[x]);
            }, error => {
              reject(error);
            }, () => {
              resolve(true);
            });
          });
        });
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
   * The following method is used to brand delivery selected or not
   * @param event
   * @param elementName
   * @param index
   */
  optionChanges(event: any, elementName: string ){
    const option = event.source
    if (!option.selected) {
      this.formGroup.get(`${elementName}_${option.value.delivery_type_id}`).setValidators(null);
    } else{
      this.formGroup.get(`${elementName}_${option.value.delivery_type_id}`).setValidators([Validators.required]);
    }
    this.formGroup.get(`${elementName}_${option.value.delivery_type_id}`).updateValueAndValidity();
    this.cd.detectChanges();
  }
}
