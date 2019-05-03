import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { map, take } from "rxjs/operators";
import { forkJoin } from "rxjs";
import { CategoryService } from "../../categories/services/category.service";
import { BrandService } from "../../brands/services/brand.service";
import { OfferService } from "./offer.service";

@Injectable()
export class OfferResolverService implements Resolve<any> {

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _offerService: OfferService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<any> | Promise<any> | any {
    const id: string | number = route.paramMap.get("id") || 0;

    return forkJoin(
      this._offerService.getOfferDetail(id)
    ).pipe(
      map((data: any) => {
        if (data.length > 0) {
          return data[0];
        }
      })
    );
  }

}
