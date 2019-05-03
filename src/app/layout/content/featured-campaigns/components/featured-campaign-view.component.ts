import { Component, OnInit, Injector } from '@angular/core';
import { FormInterface } from 'app/helpers/interfaces/form.interface';
import { ActivatedRoute } from "@angular/router";
import { locale as english } from "../i18n/en";
import { Campaign } from "../models/Campaign";
import { ValidatorFn, Validators } from '@angular/forms';
import { FeaturedCampaignsService } from '../services/featured-campaigns.service';
import { ImageCropDialogComponent } from "../../../../helpers/components/image-cropper/image-crop-dialog.component";
import { Subscription } from "rxjs";
import { Brand } from "../../brands/models/Brand";
import { SkramblerFormBaseComponent } from 'app/helpers/components/form-base.component';


@Component({
  selector: 'app-featured-campaign-view',
  templateUrl: "../templates/view.component.html",
  styleUrls: ["../styles/featured-campaign-view.component.scss"]
})
export class FeaturedCampaignViewComponent  extends SkramblerFormBaseComponent implements OnInit, FormInterface {

  
  /**
* to monitor data retrieved from the resolver
*/
private subscription$: Subscription;

impressionValue: number = 0;
  //used to check if campaign is impression type then to show used and remaning impressions.
  isCampaignImpressionType: boolean = false;
  
public imageValidates: boolean = false;

  constructor(injector: Injector,
    private _activatedRoute: ActivatedRoute, private _campaignService: FeaturedCampaignsService) {
    super(injector);
    // this.canAccessModule("categories");
    this.translationLoader.loadTranslations(english);
    this.baseModel = new Campaign();
    this.baseModel.active = 1;


  }

  ngOnInit() {
    this.translate.get("TEXT.VIEW_TITLE").subscribe((res: string) => {
      this.pageTitle = res;
     });
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
  }

  addFormValidations(): void {
    this.addFormControlWithValidations("title", [Validators.required],true);
    this.addFormControlWithValidations("description",[],true);
    this.addFormControlWithValidations("gender", [Validators.required],true);
    this.addFormControlWithValidations("from_age", [Validators.required],true);
    this.addFormControlWithValidations("to_age", [Validators.required],true);
    this.addFormControlWithValidations("start_date", [Validators.required],true);
    this.addFormControlWithValidations("end_date", [Validators.required],true);
    this.addFormControlWithValidations("impressionValueControl", [], true);
    this.addFormControlWithValidations("timingRadioSelector", [],true);
    this.formGroup.controls['timingRadioSelector'].setValue('1');
  }

  onSubmit(): void {
    throw new Error("Method not implemented.");
  }
  getErrorMessage(formElementId: string): string {
    throw new Error("Method not implemented.");
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
  if(!this.baseModel.end_date) 
  {
    this.baseModel.impressionValueControl = this.baseModel.max_impressions;
    this.impressionValue = this.baseModel.max_impressions;  
  }

  this.formGroup.patchValue({
    ...this.baseModel
  });

  this.formGroup.updateValueAndValidity();
  this.formGroup.markAsTouched();
  this.imageValidates = this.baseModel.logo ? true : false;
  if(!this.baseModel.end_date){
    this.setImpressionOnDetail('2');
    this.formGroup.get("end_date").disable();
    this.isCampaignImpressionType=true;      
    
  }
}

/**
* The following method is used to set get gender key according to constant list to set value on dropdown.
*/
private getGender(gender: any){
  if(gender=="male"){
    return "Male";
  }
  else if(gender=="female"){
    return "Female";
  }
  else if(gender=="both"){
    return "Both";
  }
}

    /**
* The following method is used to set impression if impresson type campaign.
*/
private setImpressionOnDetail(val: string){
   
  this.formGroup.get('timingRadioSelector').setValue('2');
}

}
