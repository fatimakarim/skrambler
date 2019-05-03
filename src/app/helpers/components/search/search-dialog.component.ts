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
  templateUrl: "./search-dialog.component.html"
})
export class SearchDialogComponent extends SkramblerBaseComponent {

  public title: string = "";
  public content: string = "";
  public placeholder: string = "";
  public apiUrl: string = "";
  public fields: string[] = [];

  /**
   * for setting the item data for the dropdown
   */
  public itemData: Observable<any>;
  /**
   * to keep the selected item id
   */
  public selectedItem: any = null;
  private dataObserver: Observer<any[]>;

  constructor(public dialogRef: MatDialogRef<SearchDialogComponent>,
              public injector: Injector,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super(injector);
    this.title = data.title;
    this.placeholder = data.placeholder;
    this.apiUrl = data.apiUrl;
    this.content = data.content;
    if (data.fields) {
      this.fields = data.fields;
    }

    this.itemData = new Observable(observer => this.dataObserver = observer);
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  onYesClick(): void {
    this.dialogRef.close(this.selectedItem);
  }

  onSearch(event: any) {
    // if empty then reset the selectedId value
    this.selectedItem = null;

    if (event) {
      let url = this.apiUrl;
      if (this.apiUrl.indexOf("?") > -1) {
        url += `&search=${event}`;
      } else {
        url += `?search=${event}`;
      }

      url += `&sort_key=${this.constantList.DEFAULT_SORT_KEY}&sort_order=${this.constantList.DEFAULT_SORT_ORDER}`;
      url += "&page=0";

      // Calling the listing API to get the data based on the search term i.e. coming in through event variable
      this.dataListService.getDataListing(url)
        .map(res => res.data)
        .subscribe(items => {
          this.dataObserver.next(items);
        });
    } else {
      this.dataObserver.next([]);
    }
  }

  ReferenceIdSelected(event) {
    this.selectedItem = event.option.value;
  }
}
