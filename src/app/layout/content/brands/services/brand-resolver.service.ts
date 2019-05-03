import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { map, take } from "rxjs/operators";
import { forkJoin } from "rxjs";
import { CategoryService } from "../../categories/services/category.service";
import { BrandService } from "./brand.service";

@Injectable()
export class BrandResolverService implements Resolve<any> {

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _categoryService: CategoryService,
    private _brandService: BrandService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<any> | Promise<any> | any {
    const id: string | number = route.paramMap.get("id") || 0;

    return forkJoin(
      this._categoryService.getAllParentCategories(),
      this._brandService.getBrandDetail(id)
    ).pipe(
      map((data: any) => {
        if (data.length > 0) {
          return {
            categories: data[0],
            brand: data[1],
          };
        }
      })
    );
  }

}
