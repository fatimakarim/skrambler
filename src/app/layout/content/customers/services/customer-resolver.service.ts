import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { map, take } from "rxjs/operators";
import { CustomerService } from "./customer.service";
import { forkJoin } from "rxjs";

@Injectable()
export class CustomerResolverService implements Resolve<any> {

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _customerService: CustomerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<any> | Promise<any> | any {
      {
        const id: string | number = route.paramMap.get("id") || 0;
        if (id) { // the following returns respective customer model
          return forkJoin(
            this._customerService.getCustomerDetail(id)
          ).pipe(
            map(customer => {
              if (customer) {
                return customer;
              }
              return null;
            })
          );
        } else { // the following only returns the parent customers
          return this._customerService.getAllCustomers().pipe(
            map(customer => {
              if (customer) {
                return customer;
              }
              return null;
            })
          ).catch(err => {
            return null;
          });
        }

        
      }
  }
}
