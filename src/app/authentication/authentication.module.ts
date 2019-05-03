import {NgModule} from "@angular/core";
import {LoginModule} from "./login/login.module";
import {RegisterModule} from "./register/register.module";
import {SkramblerForgotPasswordModule} from "./forgot-password/forgot-password.module";

@NgModule({
  imports: [
    LoginModule,
    RegisterModule,
    SkramblerForgotPasswordModule
  ],
  declarations: [],
})

export class AuthenticationModule {
}
