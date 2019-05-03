import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { map, take } from "rxjs/operators";
import { forkJoin } from "rxjs";
import { RedeemedOfferService } from "./redeemed-offer.service";

@Injectable()
export class RedeemedOfferResolverService implements Resolve<any> {

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _redeemedOfferService: RedeemedOfferService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<any> | Promise<any> | any {
    const id: string | number = route.paramMap.get("id") || 0;

    return forkJoin(
      this._redeemedOfferService.getRedeemedOffers(),
    ).pipe(
      map((data: any) => {
        if (data.length > 0) {

          return data;
        }
      })
    );
  }

}
