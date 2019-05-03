import { Component, OnInit, Injector } from "@angular/core";
import { SkramblerFormBaseComponent } from "../../../../helpers/components/form-base.component";
import { FormInterface } from "../../../../helpers/interfaces/form.interface";
import { ActivatedRoute } from "@angular/router";
import { locale as english } from "../i18n/en";
import { Campaign } from "../models/Campaign";
import { ValidatorFn, Validators } from "@angular/forms";
import { FeaturedCampaignsService } from "../services/featured-campaigns.service";
import { MatDialog, MatAutocompleteSelectedEvent } from "@angular/material";
import { ImageCropDialogComponent } from "../../../../helpers/components/image-cropper/image-crop-dialog.component";
import { Subscription } from "rxjs";
import { DatePipe } from "@angular/common";
import { Brand } from "../../brands/models/Brand";
import { PermissionService } from "../../../../helpers/services/permission.service";

@Component({
  selector: "app-featured-campaigns-form",
  templateUrl: "../templates/form.component.html",
  styleUrls: ["../styles/featured-campaigns-list.component.scss"]
})
export class FeaturedCampaignsFormComponent extends SkramblerFormBaseComponent implements OnInit, FormInterface {

  /**
* to monitor data retrieved from the resolver
*/
  private subscription$: Subscription;

  public imageValidates = false;

  impressionValue = 0;

  // used to check if campaign is impression type then to show used and remaning impressions.
  isCampaignImpressionType = false;

  constructor(injector: Injector,
    private _activatedRoute: ActivatedRoute,
    private dialog: MatDialog, private _campaignService: FeaturedCampaignsService,
    public _permissionService: PermissionService) {
    super(injector);
    if (!this._permissionService.isAdmin()){
      this.goTo(this.routeList.DASHBOARD_HOME);
     }
    this.translationLoader.loadTranslations(english);
    this.baseModel = new Campaign();
    this.baseModel.active = 1;


  }

  ngOnInit() {
    super.setPageTitle();
    this.addFormValidations();

    // resolving 
    this.subscription$ = this._activatedRoute.data.subscribe(
      (response: {
        data: Campaign,
      }) => {
        // if user object is retrieved
        if (response.data) {
          this.setCampaignDetail(response.data[0]);
        }
      });
     this.onChangesCtr();

  }

   /**
* the following method is used to use of campaign type either impression type or duration date type.
*/
  onChangesCtr(): void {
    this.formGroup.get("impressionValueControl").valueChanges.subscribe(val => {
      this.impressionValue = val;
    });

    // selection of timing end date control or impression control. 
    this.formGroup.get("timingRadioSelector").valueChanges.subscribe(val => {
      this.controlSelection(val);
    });

  }

  // used for control selection on timing section for End date or Number of impression.
  private controlSelection(val: string) {
    if (val === "1") {
      this.formGroup.get("impressionValueControl").setValidators([]);
      this.formGroup.get("impressionValueControl").setValue(null);
      this.formGroup.get("impressionValueControl").disable();

      this.impressionValue = 0;
      this.formGroup.get("end_date").enable();
      this.formGroup.get("end_date").setValidators([Validators.required]);
      this.formGroup.get("end_date").updateValueAndValidity();
      this.isCampaignImpressionType = false;
    }
    else if (val === "2") {
      this.formGroup.get("end_date").setValidators([]);
      this.formGroup.get("end_date").setValue(null);
      this.formGroup.get("end_date").disable();
      this.formGroup.get("impressionValueControl").enable();
      this.impressionValue = 0;
      this.formGroup.get("impressionValueControl").setValue(null);
      this.formGroup.get("impressionValueControl").setValidators([Validators.required]);
      this.formGroup.get("impressionValueControl").updateValueAndValidity();
      this.isCampaignImpressionType = true;
    } else {
      this.formGroup.get("impressionValueControl").setValidators([]);
      this.formGroup.get("impressionValueControl").setValue(null);
      this.formGroup.get("impressionValueControl").disable();
      this.isCampaignImpressionType = false;
      this.impressionValue = 0;
      this.formGroup.get("end_date").enable();
      this.formGroup.get("end_date").setValidators([Validators.required]);
      this.formGroup.get("end_date").updateValueAndValidity();
    }
    this.formGroup.updateValueAndValidity();
  }

  /**
* the following method gets the category details from the resolver
*/
  setCampaignDetail(campaign: Campaign) {
    this.baseModel = new Campaign(campaign);
    this.baseModel.active = campaign.active === 1;
    this.baseModel.brand = new Brand(campaign.brand);
    this.baseModel.mainImagePath = this.baseModel.logo;
    this.baseModel.gender = this.getGender(this.baseModel.gender);
    this.baseModel.from_age = this.baseModel.from_age.toString();
    this.baseModel.to_age = this.baseModel.to_age.toString();
    if (!this.baseModel.end_date) 
    {
      this.formGroup.get("impressionValueControl").enable();
      this.baseModel.impressionValueControl = this.baseModel.max_impressions;
      this.impressionValue = this.baseModel.max_impressions;
      
    }

    this.formGroup.patchValue({
      ...this.baseModel
    });

    this.formGroup.updateValueAndValidity();
    this.formGroup.markAsTouched();
    this.imageValidates = this.baseModel.logo ? true : false;
    if (!this.baseModel.end_date){
      this.setImpressionOnDetail("2");
      this.formGroup.get("end_date").disable();
      this.isCampaignImpressionType = true;      
      
    }
    
  }

 

   /**
 * the following method is used to get gender string according to application constant list, to set on dropdown.
 */
private getGender(gender: any){
  if (gender === "male"){
    return "Male";
  }
  else if (gender === "female"){
    return "Female";
  }
  else if (gender === "both"){
    return "Both";
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
      ._campaignService.addCampaign(this.formData, this.baseModel.business_reference_id)
      .subscribe((response: any) => {
        if (response) {
          if (response) {
            this.isSuccessful(<string>response.message, this.routeList.CAMPSIGNS_LISTING);
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
    if (this.baseModel.business_reference_id) this.formData.append("business_reference_id", this.baseModel.business_reference_id);
    this.formData.append("title", values.title.trim());
    this.formData.append("description", values.description);
    this.formData.append("active", this.baseModel.active ? "1" : "0");
    this.formData.append("gender", values.gender);
    this.formData.append("to_age", values.to_age);
    this.formData.append("from_age", values.from_age);
    this.formData.append("start_date", this.getDateFormate(values.start_date, "yyyy-MM-dd"));

    this.formData.append("brand_id", this.baseModel.brand.business_reference_id);
    this.formData.append("logo", this.baseModel.mainImage);
    if (values.impressionValueControl && values.impressionValueControl !== 0)
      this.formData.append("max_impressions", values.impressionValueControl);
    else
      this.formData.append("end_date", this.getDateFormate(values.end_date, "yyyy-MM-dd"));


    return this;
  }

  private getDateFormate(date: any, formate: string) {
    const datePipe = new DatePipe("en-US");
    return datePipe.transform(date, formate);
  }

  addFormValidations(): void {
    this.addFormControlWithValidations("title", [Validators.required]);
    this.addFormControlWithValidations("description", []);
    this.addFormControlWithValidations("gender", [Validators.required]);
    this.addFormControlWithValidations("from_age", [Validators.required]);
    this.addFormControlWithValidations("to_age", [Validators.required]);
    this.addFormControlWithValidations("start_date", [Validators.required]);
    this.addFormControlWithValidations("end_date", [Validators.required]);
    this.addFormControlWithValidations("impressionValueControl", [], true);
    this.addFormControlWithValidations("timingRadioSelector", []);
    this.formGroup.controls["timingRadioSelector"].setValue("1");
  }



  /**
     * The following method is used to catch changing status
     * @param event 
     */
  changeStatus(event: any) {
    this.baseModel.active = event.checked;
  }

  /**
   * the following method is us
   * @param event 
   */
  populateAgeTo(event: any){
    if (this.formGroup.controls.to_age.value < event.value){
      this.formGroup.get("to_age").setValue("");
      this.formGroup.get("to_age").updateValueAndValidity();
    }
  }


  /**
   * the following is called when the category is changed
   * @param selected 
   */
  onBrandChange(event: any) {
    if (event) {
      this.baseModel.brand = event.brand;
    }
  }

  openImageDialog(brandImageType: number | number) {

    const dialogRef = this.dialog.open(ImageCropDialogComponent, {
      width: this.constantList.POP_UP_DEFAULT_WIDTH,
      data: {
        file_size_error: english.data.TEXT.SIZE_ERROR,
        title: english.data.TEXT.POP_TITLE,
        sub_title: english.data.TEXT.POP_SUB_TITLE,
        file_size_limit: this.constantList.BRAND_IMAGE_SIZE,
        aspect_ratio: this.constantList.DEFAULT_IMAGE_PHOTO_ASPECT_RATIO
      }
    });

    // setting the observer for detecting popup close action
    dialogRef.afterClosed().subscribe(blob => {
      // only if the cropped image is selected
      if (blob && brandImageType === this.constantList.CAMPAIGN_MAIN_IMAGE_TYPE) {
        const file: File = new File([blob], "filename.png");
        this.baseModel.mainImageDataURI = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
        this.baseModel.mainImagePath = null;
        this.baseModel.mainImage = file;
        this.imageValidates = true;
      }
    });
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
        return english.data.INPUT.TITLE.REQUIRED_ERROR;
      }
    } else {
      return "";
    }
  }

    /**
* The following method is used to set impression if impresson type campaign.
*/
  private setImpressionOnDetail(val: string){
   
    this.formGroup.get("timingRadioSelector").setValue("2");
  }

}
