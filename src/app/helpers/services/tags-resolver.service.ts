import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { map, take } from "rxjs/operators";
import { DataListingService } from "./data-listing.service";

@Injectable()
export class TagsResolverService implements Resolve<any> {

  constructor(
    private _dataListingService: DataListingService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<any> | Promise<any> | any {
    const id: string | number = route.paramMap.get("id") || 0;
    // the following only returns the parent categories
    return this._dataListingService.getAllTags().pipe(
      map(tags => {
        if (tags) {
          return tags;
        }
        return null;
      })
    ).catch(err => {
      return null;
    });

  }

}
