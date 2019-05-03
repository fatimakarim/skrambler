import {
  Component,
  EventEmitter,
  Input,
  Output,
  Injector,
  OnInit,
  OnDestroy
} from "@angular/core";
import {Observable, Subscription, from} from "rxjs";
import { MatSelectChange , MatAutocompleteSelectedEvent} from "@angular/material";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as _moment from "moment";
import {default as _rollupMoment} from "moment";
import { filter } from "rxjs/operators";
import {SharedDataService} from "../../../../helpers/services/shared-data.service";

const moment = _rollupMoment || _moment;

import {locale as english} from "./i18n/en";
import * as Constants from "../../../../helpers/constants/constant-list";
import {SkramblerFormBaseComponent} from "../../../../helpers/components/form-base.component";

import {reject} from "q";

@Component({
  selector: "skrambler-table-filters",
  templateUrl: "./filters.component.html",
})
export class SkramblerTableFiltersComponent extends SkramblerFormBaseComponent implements OnInit, OnDestroy {
  public _constants = Constants;
  public params: Object = {};
  private routeParamSub$: Subscription;
  public filteredOptions: Observable<any[]>;
  public options: any[];

  @Input() filters: any[] = [];
  public _filters: any[] = [];

  @Output() searchClick: EventEmitter<any> = new EventEmitter<any>();

  constructor(injector: Injector) {
    super(injector);
    this.translationLoader.loadTranslations(english);
  }

  ngOnInit() {
    this.filters.forEach((filter: any) => {
      // this.params[filter.key] = filter.value || null;
      this.addFormControlWithValidations(filter.key, []);
    });

    this._filters = this.getChunkArray(this.filters, 2);

    this.routeParamSub$ = this.route.queryParams
      .subscribe(params => {
        if (this.filters.length) {
          Object.keys(params).forEach(key => {
            this.setFilterSelectedValue(key, params[key]);
          });
        }
      });
  }

  ngOnDestroy() {
    if (this.routeParamSub$) {
      this.routeParamSub$.unsubscribe();
    }
  }

  setFilterSelectedValue(key: string, value: any): void {
    const index = this.filters.
      map(item => item.key)
      .indexOf(key);
    if (index > -1) {
      let filter = this.filters[index];
      filter["selectedValue"] = value;
      this.filters[index] = filter;
      this.params[key] = value;

      this.formGroup.get(key)
        .patchValue(value);
      this.formGroup.get(key).updateValueAndValidity({onlySelf: true});
    }

    this._filters = this.getChunkArray(this.filters, 2);
  }

  emitSearchEvent(reset: boolean = false) {
    if (Object.keys(this.params).length > 0 || reset) {
      this.sharedDataService.submitFilterForm(true);
      this._filters = this.getChunkArray(this.filters, 2);
      this.searchClick.emit({ params: this.params, filters: this.filters });

    }
  }

  onSelectChange(event: MatSelectChange, filterKey: string = "") {
      this.setFilterValue(event.value, filterKey);

  }

  onAutocompleteChange(event: MatAutocompleteSelectedEvent, filterKey: string = "") {
    if (event) {
      this.setFilterValue(event.option.value, filterKey);
      const selected = this.options.filter((t: any) =>
        t.email.toLowerCase().indexOf(event.option.value.toLowerCase()) === 0)[0];
      this.params[filterKey] = selected["id"];

    }
  }

  onInputChange(value: string | null, filterKey: string = "") {
    this.setFilterValue(value, filterKey);
  }

  setFilterValue(value: string | null, filterKey: string = "") {
    if (filterKey) {
      this.params[filterKey] = value;
      const index = this.filters.
        map(item => item.key)
        .indexOf(filterKey);
      if (index > -1) {
        let filter = this.filters[index];
        filter["selectedValue"] = value;
        this.filters[index] = filter;
        this.params[filterKey] = value;
      }
    }
  }

  changeDate(event: MatDatepickerInputEvent<Date>, filterKey: string = "") {
    const value = moment(event.value);
    if (filterKey) {
      const filter = this.filters.find(filter => {
        return filter.key === filterKey;
      });

      if (filter) {
        switch (filter.type) {
          case "date":
            this.params[filter.key] = filter.format
              ? value.format(filter.format)
              : value.format(this._constants.DEFAULT_DATE_FORMAT);

            this.setFilterValue(value.format(this._constants.DEFAULT_DATE_FORMAT), filterKey);
            break;
          case "time":
            this.params[filter.key] = filter.format
              ? value.format(filter.format)
              : value.format(this._constants.DEFAULT_TIME_FORMAT)
            break;
          case "datetime":
            this.params[filter.key] = filter.format
              ? value.format(filter.format)
              : value.format(this._constants.DEFAULT_DATETIME_FORMAT)
            break;

          default:
            this.params[filter.key] = "";
            break;
        }
      }
    }
  }

  public compareSingleDropdownFn(value1, value2): boolean {
    if (typeof value1 === "undefined" || typeof value2 === "undefined" || value2 === "") {
      return false;
    }

    return value1 === value2;
  }

  /**
   * when click on reset botton so all filter selected value should be remove
   */
  resetFilterSelectedValue(): void{
    Observable.range(0, this.filters.length).subscribe((x) => {
     delete this.filters[x]["selectedValue"] ;
    }, error => {
      reject(error);
    }, () => {
  });

  }

  resetForm(): void {
    this.formGroup.reset();
    this.params = {};
    this.resetFilterSelectedValue();
    this.emitSearchEvent(true);
  }
}
