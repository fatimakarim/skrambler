import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { FeaturedCampaignsService } from "./featured-campaigns.service";
import { Observable } from "rxjs/Observable";
import { map, take } from "rxjs/operators";
import { forkJoin } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FeaturedCampaignsResolverService {

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _featuredCampaignService: FeaturedCampaignsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<any> | Promise<any> | any {
    const id: string | number = route.paramMap.get("id") || 0;
    if (id) { // the following returns parent categoryes & respective category model
      return forkJoin(
        this._featuredCampaignService.getCampaignById(id)
      ).pipe(
        map((data: any) => {
          return data;
        })
      );
    } else { // the following only returns the parent categories
      return forkJoin(
        this._featuredCampaignService.getAllCampaigns()
      ).pipe(
        map(users => {
          if (users) {
            return users;
          }
          return null;
        })
      );
    }
  }

}
