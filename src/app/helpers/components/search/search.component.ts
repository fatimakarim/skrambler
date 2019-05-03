import { Component, EventEmitter, Injector, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { ValidatorFn, Validators } from "@angular/forms";
import { SkramblerFormBaseComponent } from "../form-base.component";

@Component({
  selector: "skrambler-search",
  templateUrl: "./search.component.html"
})
export class SearchComponent extends SkramblerFormBaseComponent implements OnInit {

  /**
   * used to render results
   */
  @Input() results: Observable<any>;
  /**
   * used to define the placeholder text for the input
   */
  @Input() placeHolderText: string;
  /**
   * used to define the error text for the input field
   */
  @Input() errorText: string;

  /**
   * The text that needs to be shown in the tooltip
   */
  @Input() toolTipText: string;

  @Input() hide: string;

  /**
   * The following determines if the dropdown is the required field or not
   * @type {boolean}
   */
  @Input() isRequiredField: boolean = false;/**

  * To dispaly text for field vise
   * @type {boolean}
   */
  @Input() fields: string[] = [];

  /**
   * searchevent triggered on any change in the input field
   * @type {EventEmitter<any>}
   */
  @Output() searchEvent: EventEmitter<any> = new EventEmitter();
  /**
   * used to trigger the selection of any value from the dropdown
   * @type {EventEmitter<any>}
   */
  @Output() selectedBusinessReferenceIdEvent: EventEmitter<string> = new EventEmitter();

  /**
   * the following variable detects whether the subscribe event was triggered after the selection or on normal input in the textfield
   * @type {boolean}
   */
  public isEventEmittedAfterSelection: boolean = false;


  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {

    /**
     * add the form validations if Required else just add the form control
     * @type {(control: AbstractControl) => (ValidationErrors | null)[]}
     */
    if (this.isRequiredField) {
      let requiredValidation: ValidatorFn[] = [Validators.required];
      this.addFormControlWithValidations("search_box", requiredValidation);
    } else this.addFormControlWithValidations("search_box");

    // Emit the changes
    this.formGroup
      .controls["search_box"]
      .valueChanges
      .debounceTime(this.constantList.DEFAULT_DEBOUNCE_TIME)
      .subscribe((event) => {
        // if the event flow is coming from after selecting the option from dropdown then down reset the errors
        if (this.isEventEmittedAfterSelection) this.isEventEmittedAfterSelection = false;
        else {
          // the following make sure, that if the user tries to type in the input field, the error is show
          // so that the user is forced to select from the dropdown in which case the error is gone
          if (this.isRequiredField) this.formGroup.controls["search_box"].setErrors({ "incorrect": true });
          this.searchEvent.emit(event);
        }
      });
  }


  /**
   *  The following method is used to get the respective error message for the respective element Id
   * @returns {string}
   */
  getErrorMessage(): string {
    return this.errorText;

  };

  /**
   * The following method is triggered when any option is selected
   * @param event
   */
  optionSelected(event) {
    this.isEventEmittedAfterSelection = true;
    // reset the errors as the option has been selected
    this.formGroup.controls["search_box"].setErrors(null);
    // setting the value for the front-end input field
    this.formGroup.controls["search_box"].setValue(this.getFormattedText(event.option.value));
    // emitting it for the parent component to set it in the respective baseModel instance
    this.selectedBusinessReferenceIdEvent.emit(event);
  }

  /**
   * the following sets the value in the search box
   * @param {number} value
   */
  public setValue(value: number) {
    this.isEventEmittedAfterSelection = true;
    this.formGroup.controls["search_box"].setValue(value);
    this.formGroup.controls["search_box"].setErrors(null);
    this.formGroup.updateValueAndValidity();
  }

  public validateFormField() {
    Object.keys(this.formGroup.controls).forEach(field => { // {1}
      const control = this.formGroup.get(field);            // {2}
      control.markAsTouched({ onlySelf: true });       // {3}
    });
  }

  public getFormattedText(item: any): string {
    let text = "";
    if (this.fields.length) {
      this.fields.forEach(field => {
        text += `${item[field]} `;
      });
    } else {
      text = item.name ? item.name : item.businessReferenceId;
    }

    return text.trim();
  }
}
