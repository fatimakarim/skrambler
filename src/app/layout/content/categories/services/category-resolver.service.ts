import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { map, take } from "rxjs/operators";
import { CategoryService } from "./category.service";
import { forkJoin } from "rxjs";
import { PermissionService } from "../../../../helpers/services/permission.service";

@Injectable()
export class CategoryResolverService implements Resolve<any> {

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _categoryService: CategoryService, public _permissionService: PermissionService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<any> | Promise<any> | any {
    const id: string | number = route.paramMap.get("id") || 0;
    if (id) { // the following returns parent categoryes & respective category model
      if (this._permissionService.isAdmin()) {
        return forkJoin(
          this._categoryService.getAllParentCategories(),
          this._categoryService.getCategoryDetail(id)
        ).pipe(
          map((data: any) => {
            if (data.length > 0) {
              return {
                categories: data[0],
                category: data[1],
              };
            } else if (data.length === 1) {
              return {
                categories: data[0]
              };
            }
          })
        );
      }
      else {
        return [];
      }
    } else { // the following only returns the parent categories
      if (this._permissionService.isAdmin()) {
        return this._categoryService.getAllParentCategories().pipe(
          take(1),
          map(category => {
            if (category) {
              return {
                categories: category
              };
            }
            return null;
          })
        ).catch(err => {
          return null;
        });
      }
      else {
        return [];
      }
    }
  }

}
