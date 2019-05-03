import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import { UserService } from "./user.service";
import { forkJoin } from "rxjs";

@Injectable()
export class UserResolverService implements Resolve<any> {

  constructor(private _userService: UserService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<any> | Promise<any> | any {
    const id: string | number = route.paramMap.get("id") || 0;
    if (id) { // the following returns parent categoryes & respective category model
      return forkJoin(
        this._userService.getUserById(id)
      ).pipe(
        map((data: any) => {
          const resolverData =  data.filter((p) => p.brand.length > 0  ? p.brand = p.brand[0] : [] )
          return resolverData;
        })
      );
    } else { // the following only returns the parent categories
      return forkJoin(
        this._userService.getAllUsers()
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
