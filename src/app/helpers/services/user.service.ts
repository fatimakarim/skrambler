import { Injectable, Injector } from "@angular/core";
import { throwError } from "rxjs";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { share, map, shareReplay, tap } from "rxjs/operators";
import { User } from "../models/User";
import { BaseNetworkService } from "./base-network.service";
import "rxjs/add/observable/of";
import * as API_LIST from "../constants/apis-list";
import * as CryptoJS from "crypto-js";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Role } from "app/layout/content/users/models/roles";

@Injectable()
export class UserService extends BaseNetworkService {
  private loggedIn = false;
  private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private rolesSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private errors;

  constructor(private injector: Injector) {
    super(injector);
    this.user = this.sessionService.get("user") ?  this.sessionService.getDataInSessionStorage("user") : this.localStorageService.getDataInLocalStorage("user");
    this.roles =  this.sessionService.get("roles") ?  this.sessionService.getDataInSessionStorage("roles") : this.localStorageService.getDataInLocalStorage("roles");
    this.userSubject.next(this.user);
    this.rolesSubject.next(this.roles);
    
  }

  fetchUserInfo(): Observable<User> {
    return this.userSubject.pipe(
      share()
    );
  }

  /**
   * the following method is used to reset the respective user's password
   * @param param0 
   */
  resetPassword({ email, code, password }: { email: string, code: string, password: string }): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = "code=" + code;
      body += "&new_password=" + password;
      body += "&username=" + email;
      return this.http
        .post(API_LIST.RESET_PASSWORD, body, {
          headers: this.headers
        })
        .subscribe(json => {
          const jsonData = this.parseResponse(json);
          if (jsonData.response === this.constantList.ResponseSuccess) {
            resolve(jsonData);
          } else {
            this.handleErrorMessages(json);
            Observable.timer(this.constantList.DEFAULT_REDIRECTION_WAIT_TIME)
            .subscribe(() => {
              resolve(true);
            });
          }
        }, error => {
          this.rejectErrorMessages(error, reject);
        });
    });
  }

  /**
   * the following method is used to post request to receive email
   * @param email 
   */
  postForgotPasswordRequest(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = "username=" + email;
      return this.http
        .post(API_LIST.FORGOT_PASSWORD,
          body, {
            headers: this.headers
          })
        .subscribe(json => {
          const jsonData = this.parseResponse(json);
          if (jsonData.response === this.constantList.ResponseSuccess) {
            resolve(jsonData);
          } else {
            this.handleErrorMessages(json);
            Observable.timer(this.constantList.DEFAULT_REDIRECTION_WAIT_TIME)
            .subscribe(() => {
              resolve(true);
            });
          }
        }, error => {
          this.rejectErrorMessages(error, reject);
        });
    });
  }

  login(body: { email, password }, rememberUser: boolean = false) {
    return this.http
      .post(this.apiList.LOGIN_API, body,
        { headers: this.headers, params: body })
      .pipe(
        map((response: HttpResponse<{ response: string, status: string }>) => {
          this.clearErrors();
          if (<any>response.status === this.constantList.SUCCESS_STATUS) {
            return response;
          } else {
            this.handleErrorMessages(response);
          }
          return null;
        }),
        tap((authResult: any) => {
          if (authResult) {
            if (rememberUser) {
              this.setLocalSession(authResult.data);
              this.user = this.localStorageService.getDataInLocalStorage("user");
              this.roles =  this.localStorageService.getDataInLocalStorage("roles");
            } else {
              this.setSessionStorage(authResult.data);
              this.user = this.sessionService.getDataInSessionStorage("user");
              this.roles = this.sessionService.getDataInSessionStorage("roles");
            }

            return true;
          }
          return false;
        }),
      ).catch((e: any) => throwError(this.handleErrorMessages(e)));
  }


  forgetPassword(username: string) {
    return this.http
      .post(this.apiList.FORGOT_PASSWORD, {},
        { headers: this.headers, params: { username: username } })
      .pipe(
        map((response: HttpResponse<{ response: string, status: string }>) => {
          if (<any>response.status === this.constantList.SUCCESS_STATUS) {
            return response;
          } else {
            this.clearErrors();
            this.showMessage(response["message"]);
            return null;
          }
        })
      ).catch((e: any) => throwError(this.handleErrorMessages(e.error)))
      .toPromise();
  }

  confirmPassword(formData) {
    return this.http
      .post(this.apiList.RESET_PASSWORD, {},
        { headers: this.headers, params: formData })
      .pipe(
        map((response: HttpResponse<{ response: string, status: string }>) => {
          if (<any>response.status === this.constantList.SUCCESS_STATUS) {
            return response;
          } else {
            this.clearErrors();
            this.showMessage(response["message"]);
            return null;
          }
        })
      ).catch((e: any) => throwError(this.handleErrorMessages(e.error)))
      .toPromise();
  }

  logout() {
    this.localStorageService.clearDataInLocalStorage();
    this.sessionService.cleatDataInSessionStorage();
    this.router.navigate([this.routeList.LOGIN]);
  }

  updateProfile(body: User, image: string | null) {
    const formData = {
      phone: body.profile.phone,
      first_name: body.profile.first_name,
      last_name: body.profile.last_name,
    };

    if (image) {
      formData["user_profile_picture"] = image;
    }

    if (body.profile.description) {
      formData["description"] = body.profile.description;
    }

    return this.http
      .post(this.apiList.PROFILE_UPDATE, formData,
        { headers: this.headers })
      .pipe(
        map((response: HttpResponse<{ response: string, status: string, data: Object }>) => {
          if (<any>response.status === this.constantList.SUCCESS_STATUS) {
            return response["data"];
          }

          this.clearErrors();
          this.showMessage(response["message"]);
          return null;
        }),
        tap(user => {
          if (user) {
            this.user = user;
            this.userSubject.next(this.user);
            this.sessionService.setDataInSessionStorage({ key: "user", value: this.user });
            return true;
          }
          return false;
        }),
        shareReplay(),
      ).catch((e: any) => throwError(this.handleErrorMessages(e)));
  }

  updatePassword(formData: FormData) {
    return this.http
      .post(this.apiList.PROFILE_UPDATE_PASSWORD, formData,
        { headers: this.formDataHeaders })
      .pipe(
        map((response: HttpResponse<{ response: string, status: string, data: Object }>) => {
          if (<any>response.status === this.constantList.SUCCESS_STATUS) {
            this.showMessage(response["message"]);
            return response;
          } else {
            this.clearErrors();
            this.handleErrorMessages(response);
            return null;
          }
        }),
        shareReplay(),
      ).catch((e: any) => throwError(this.handleErrorMessages(e)));
  }

  public isLoggedIn(): boolean {
    return (
      this.sessionService.get("skrambler_token")
      || this.localStorageService.getDataInLocalStorage("skrambler_token")
    );
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }

  private setLocalSession(authResult: { token: string, permissions: any, user: any, role: any }) {
    this.localStorageService.setDataInLocalStorage({ key: "skrambler_token", value: authResult.token });
    this.localStorageService.setDataInLocalStorage({ key: "permissions", value: authResult.user.permissions });
    this.localStorageService.setDataInLocalStorage({ key: "user", value: authResult.user });
    this.localStorageService.setDataInLocalStorage({ key: "roles", value: authResult.user.role });
  }

  private setSessionStorage(authResult: { token: string, permissions: any, user: any, role: any }) {
    this.sessionService.setDataInSessionStorage({ key: "skrambler_token", value: authResult.token });
    this.sessionService.setDataInSessionStorage({ key: "permissions", value: authResult.user.permissions });
    this.sessionService.setDataInSessionStorage({ key: "user", value: authResult.user });
    this.sessionService.setDataInSessionStorage({ key: "roles", value: authResult.user.role });
  }
  addUser(formData, id?: number | string) {
    const url: string = id ? `${this.apiList.GET_USERS}/${id}` : this.apiList.GET_USERS;
    return this.http
      .post(url, {},
        { headers: this.headers, params: formData })
      .pipe(
        map((response: HttpResponse<{ response: string, status: string, data: Object }>) => {
          if (<any>response.status === this.constantList.SUCCESS_STATUS) {
            return response;
          } else {
            this.clearErrors();
            this.handleErrorMessages(response);
            return null;
          }
        })
      ).catch((e: any) => throwError(this.handleErrorMessages(e.error)));
  }

  getUserDetail(id: number | string) {
    return this.http
      .get(`${this.apiList.GET_USERS}/${id}`,
        { headers: this.headers })
      .pipe(
        map((response: HttpResponse<{ response: string, status: string, data: Object }>) => {
          if (<any>response.status === this.constantList.SUCCESS_STATUS) {
            return response["data"];
          } else {
            this.clearErrors();
            this.handleErrorMessages(response);
            return null;
          }
        })
      ).catch((e: any) => throwError(this.handleErrorMessages(e.error)));
  }

  removeUser(id: number | string) {
    return this.http
      .delete(`${this.apiList.GET_USERS}/${id}`,
        { headers: this.headers })
      .pipe(
        map((response: HttpResponse<{ response: string, status: string, data: Object }>) => {
          if (<any>response.status === this.constantList.SUCCESS_STATUS) {
            return response;
          } else {
            this.clearErrors();
            this.handleErrorMessages(response);
            return null;
          }
        })
      ).catch((e: any) => throwError(this.handleErrorMessages(e.error)));
  }
}
