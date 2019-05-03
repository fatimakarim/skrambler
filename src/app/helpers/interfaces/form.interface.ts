import {FormGroup} from "@angular/forms";

export interface FormInterface {


  /**
   * The following holds the reference to the form group variable
   */
  formGroup: FormGroup;

  /**
   * The following method is used to handle the form submission
   */
  onSubmit(): void;

  /**
   *  The following method is used to get the respective error message for the respective element Id
   * @param {string} formElementId
   * @returns {string}
   */
  getErrorMessage(formElementId: string): string;


  /**
   * The following method adds the form validations
   */
  addFormValidations(): void;

}
