import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { Observable } from "rxjs/Observable";
import { ValidatorFn, Validators, FormControl } from "@angular/forms";
import { SkramblerBaseComponent } from "../base.component";
import { MatAutocompleteSelectedEvent } from "@angular/material";
import { Brand } from "app/layout/content/brands/models/Brand";
import { SkramblerFormBaseComponent } from "../form-base.component";
import { map, startWith, debounceTime, distinctUntilChanged, switchMap, finalize } from "rxjs/operators";
import { BrandService } from "app/layout/content/brands/services/brand.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "skrambler-brand-search",
  templateUrl: "./brand-search.component.html"
})
export class BrandSearchComponent extends SkramblerFormBaseComponent implements OnInit {



  /**
 * the following holds the filtered sub-categories based on the user enetred query
 */
  public filteredBrands: Observable<any[]>;

  /**
   * the following holds the reference to all the loaded brands
   */
  public brands: Brand[] = [];

  /**
 * used to trigger the selection of any value from the dropdown
 * @type {EventEmitter<any>}
 */

  @Input() isRequired: boolean;
  @Input() isDisabled = false;
  @Input() placeHolderText: string;
  @Input() preSelectedBrand: Brand;

  //used to get brands by passed category id.
  @Input() categoryId: string;

  /**
   * the following intialized the brand FormControl
   */
  public brand = new FormControl();

  /**
   * the following is used to emit the text
   */
  @Output()
  selectedBrand: EventEmitter<Brand> = new EventEmitter();

  /**
   * the following observes loading behavior for the respective API call
   */
  private loadingSubject = new BehaviorSubject<boolean>(false);

  /**
   * the following listens for any changes in loading behavior
   */
  public loading$ = this.loadingSubject.asObservable();

  constructor(injector: Injector, public _brandService: BrandService) {
    super(injector);
  }

  ngOnInit() {
    // the following observes for the loading enables and disables the BRAND search field
    this.loadingSubject.subscribe(value => {
      if (value) this.brand.disable();
      else this.brand.enable();
    });

    this.filteredBrands = this.brand.valueChanges
      .pipe(
        startWith(""),
        debounceTime(this.constantList.DEFAULT_DEBOUNCE_TIME),
        distinctUntilChanged(),
        switchMap(val => {
          return this.baseModel && this.baseModel.brand && this.baseModel.brand.name === val ? [] : this.filterBrands(val);
        })
      );

    // if the preSelectedBrand is specified
    if (this.preSelectedBrand) {
      this.brand.setValue(this.preSelectedBrand.name);
      this.baseModel = this.preSelectedBrand;
    }

    // if its required, then add the respective validator
    if (this.isRequired) this.brand.setValidators(Validators.required);

    // if disabled.
    if (this.isDisabled) this.brand.disable();

  }
  /**
   * the following method is used set brand after view initilize
   * @param brand 
   * * @param setDisable disabled in case of true. 
   */
  setBrand(brand: Brand, setDisable: boolean){
    
    this.brand.setValue(brand.name);
    this.baseModel = brand;
    if(setDisable){
      this.brand.disable();
    }
  }

  /**
   * the following method is used to filter sub-categories
   * @param val 
   */
  private filterBrands(val: string) {
    if (val) {
      this.loadingSubject.next(true);
      return this._brandService.getBrandsWithName(val,this.categoryId).pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(response => {
          this.brands = response;
          return this.brands;
        })
      );
    } else {
      this.selectedBrand.emit(null);
      return [];
    }
  }


  /**
* the following is called when the category is changed
* @param selected 
*/
  onBrandChange(selected: MatAutocompleteSelectedEvent) {
    if (selected) {
      this.baseModel.brand = this.brands.filter((t: any) =>
        t.name.toLowerCase().indexOf(selected.option.value.toLowerCase()) === 0)[0];
      this.selectedBrand.emit(this.baseModel);
    }
  }
  /**
   *  The following method is used to get the respective error message for the respective element Id
   * @returns {string}
   */
  getErrorMessage(): string {
    return "It's a required field";
  }
}
