import { Component, ViewEncapsulation, Injector, HostBinding, OnDestroy } from "@angular/core";
import {Subscription} from "rxjs/Subscription";
import { FormControl, FormGroup, ValidatorFn } from "@angular/forms";
import { SkramblerBaseComponent } from "./base.component";

/*
 * Base Component
 * Top Level Component
 */
@Component({
    selector: "skrambler-form-base-component",
    encapsulation: ViewEncapsulation.None,
    template: ""
})
export class SkramblerFormBaseComponent extends SkramblerBaseComponent implements OnDestroy {

    /**
     * The following is the baseModel instance to the rendered form on the UI
     * @type {FormGroup}
     */
    public formGroup: FormGroup = new FormGroup({});
    public formData: FormData = new FormData();
    /**
     * the following is used to keep the page title based on whether its add or edit form
     */
    public pageTitle: string;

    private formSubmitSubscription$: Subscription;
    protected dataSubscription$: Subscription;

    /*@HostBinding("class.h-100-p") fullHeightClass: Boolean = true;*/
    @HostBinding("class.overflow-scroll") overFlowScrollClass: Boolean = true;

    constructor(injector: Injector) {
        super(injector);
        /**
         * the following method is used to monitor the status for toggle submit button
         */
        this.formSubmitSubscription$ = this.sharedDataService.loadingBarStatus.subscribe(bool => {
            if (typeof bool !== null) {
                this.isFormSubmitted = bool;
                if (bool === true) {
                    this.formGroup.disable();
                } else {
                    this.formGroup.enable();
                }
            }
        });
    }

    ngOnDestroy() {
        if (this.formSubmitSubscription$) {
            this.formSubmitSubscription$.unsubscribe();
        }

        if (this.dataSubscription$) {
            this.dataSubscription$.unsubscribe();
        }
    }

    
    /**
     * The following adds the respective control with its respective form validation
     * @param formElement
     * @param validations
     * @param disabled
     * @param formGroup
     */
    protected addFormControlWithValidations(formElement: string, validations: ValidatorFn[] = [], disabled = false, formGroup?: FormGroup, defaultValue?: any): void {
        if (formGroup) {
            formGroup.addControl(formElement, new FormControl({ value: defaultValue, disabled: disabled }, validations));
            formGroup.updateValueAndValidity({ onlySelf: true });
            formGroup.markAsTouched({ onlySelf: true });
        } else {
            this.formGroup.addControl(formElement, new FormControl({ value: defaultValue, disabled: disabled }, validations));
            this.formGroup.updateValueAndValidity({ onlySelf: true });
            this.formGroup.markAsTouched({ onlySelf: true });
        }
    }

    /**
     * The following adds the respective control with its respective form validation
     * @param formElement
     * @param validations
     * @param disabled
     * @param formGroup
     */
    protected removeFormControl(formElement: string, formGroup?: FormGroup): void {
        if (formGroup) {
            if (formGroup.get(formElement)) {
                formGroup.removeControl(formElement);
                formGroup.updateValueAndValidity({ onlySelf: true });
                formGroup.markAsTouched({ onlySelf: true });
            }
        } else {
            if (this.formGroup.get(formElement)) {
                this.formGroup.removeControl(formElement);
                this.formGroup.updateValueAndValidity({ onlySelf: true });
                this.formGroup.markAsTouched({ onlySelf: true });
            }
        }
    }

    /**
     * The following sets the page title
     */
    protected setPageTitle(): void {
        this.route.params.subscribe(params => {
            // in EDIT Mode
            if (params["id"]) {
                this.translate.get("TEXT.EDIT_TITLE").subscribe((res: string) => {
                    this.pageTitle = res;
                });
            } else {
                this.translate.get("TEXT.ADD_TITLE").subscribe((res: string) => {
                    this.pageTitle = res;
                });
            }
        });
    }

    /**
     * The following method is used to disable the respective form groups
     * @param {FormGroup[]} formGroupArray
     */
    protected disableForm(formGroupArray: FormGroup[]): void {
        // stopping emitting event
        for (const formGroup of formGroupArray) {
            formGroup.disable({ onlySelf: true, emitEvent: false });
        }
    }

    /**
     * The following method is used to enable the respective form group
     * @param {FormGroup[]} formGroupArray
     */
    protected enableForm(formGroupArray: FormGroup[]): void {
        // stopping emitting event
        for (const formGroup of formGroupArray) {
            formGroup.enable({ onlySelf: true, emitEvent: false });
        }
    }

    /**
     * The following method is used to disable the respective form control
     * @param {FormGroup} formGroup
     */
    protected disableFormControl(formGroup: FormGroup, controlName: string = ""): void {
        if (controlName && formGroup.controls[controlName]) {
            // stopping emitting event
            formGroup.controls[controlName].disable({ onlySelf: true, emitEvent: false });
        }
    }

    /**
     * The following method is used to enable the respective form control
     * @param {FormGroup} formGroup
     */
    protected enableFormControl(formGroup: FormGroup, controlName: string = ""): void {
        // stopping emitting event
        if (controlName && formGroup.controls[controlName]) {
            // stopping emitting event
            formGroup.controls[controlName].enable({ onlySelf: true, emitEvent: false });
        }
    }

    isFormDisable(): boolean {
        return this.isFormSubmitted || this.formGroup.invalid;
    }
}
