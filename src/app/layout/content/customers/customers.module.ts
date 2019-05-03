import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from '@angular/common';
import { CustomerService } from "./services/customer.service";
import { CustomerResolverService } from "./services/customer-resolver.service";
import { SharedModule } from "../../../theme-core/modules/shared.module";
import { CustomerListComponent } from "./components/customer-list.component";
import { CustomerViewComponent } from './components/customer-view.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: CustomerListComponent,
        resolve: {
          customers: CustomerResolverService
        }
      },
      {
        path: "view/:id",
        component: CustomerViewComponent,
        resolve: {
          customers: CustomerResolverService
        }
      },
      {
        path: "**",
        redirectTo: "",
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [CustomerViewComponent, CustomerListComponent] ,
  providers: [
    CustomerService, CustomerResolverService
  ]
})
export class CustomersModule { }
