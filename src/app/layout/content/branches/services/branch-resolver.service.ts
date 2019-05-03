import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { map, take } from "rxjs/operators";
import { forkJoin } from "rxjs";
import { CategoryService } from "../../categories/services/category.service";
import { BranchService } from "./branch.service";

@Injectable()
export class BranchResolverService implements Resolve<any> {

  constructor(
    private _branchService: BranchService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<any> | Promise<any> | any {
    const id: string | number = route.paramMap.get("id") || 0;

    return forkJoin(
      this._branchService.getBranchDetail(id)
    ).pipe(
      map((data: any) => {
        if (data.length > 0) {
          return {
            branch: data[0],
          };
        }
      })
    );
  }

}
