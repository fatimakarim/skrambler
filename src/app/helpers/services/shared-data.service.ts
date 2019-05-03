import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class SharedDataService {

  private messageSource = new BehaviorSubject("");
  searchQuery = this.messageSource.asObservable();

  private loadingBarSource = new BehaviorSubject(false);
  loadingBarStatus = this.loadingBarSource.asObservable();

  private formSubmitbuttonSource = new BehaviorSubject(false);
  formSubmitbuttonStatus = this.formSubmitbuttonSource.asObservable();

  private filterFromSubmitSource = new BehaviorSubject(false);
  filterFromSubmitStatus = this.filterFromSubmitSource.asObservable();

  constructor() { }

  /**
   * the following method is used to emit for search queries
   * @param message 
   */
  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  /**
   * the following method is used to emit for loading bar
   * @param status 
   */
  showLoadingBar(status: boolean) {
    this.loadingBarSource.next(status);
  }

  /**
   * the following method is used to emit for loading bar
   * @param status 
   */
  changeFormSubmitStatus(submit: boolean) {
    this.formSubmitbuttonSource.next(submit);
  }

  /**
   * the following method is used to emit for filters
   * @param sfilter
   */
  submitFilterForm(submit: boolean) {
    this.filterFromSubmitSource.next(submit);
  }
}
