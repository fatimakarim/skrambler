import {Component, Inject, Injector} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import {SkramblerBaseComponent} from "../base.component";
import "rxjs/add/observable/of";
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";

@Component({
  selector: "skrambler-country-search-dialog",
  templateUrl: "./country-search-dialog.component.html"
})
export class CountrySearchDialogComponent extends SkramblerBaseComponent {

  public title: string;
  public content: string;

  /**
   * for setting thr country data for the dropdown
   */
  public countryData: Observable<any>;
  /**
   * to keep the selected countryId
   */
  public selectedCountry: any = null;
  private countryDataObserver: Observer<any>;

  constructor(public dialogRef: MatDialogRef<CountrySearchDialogComponent>,
              public injector: Injector,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super(injector);
    this.title = "";
    this.content = data.content;
    this.countryData = new Observable(observer => this.countryDataObserver = observer);

  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  onYesClick(): void {
    this.dialogRef.close(this.selectedCountry);
  }

  onCountrySearch(event: any) {
    // if empty then reset the selectedBrandId value
    this.selectedCountry = null;

    if (event) {
      // Calling the listing API to get the data based on the search term i.e. coming in through event variable
      this.dataListService.getDataListing(`${this.apiList.GET_COUNTRIES}?search=${event}`)
          .map(res => res.data.items)
          .subscribe(items => {
            this.countryDataObserver.next(items);
          });
    } else {
      this.countryDataObserver.next([]);
    }
  }

  countryIdSelected(event) {
    this.selectedCountry = event.option.value;
  }
}
