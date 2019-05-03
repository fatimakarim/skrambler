import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { map, shareReplay } from "rxjs/operators";
import { HttpParams } from "@angular/common/http/src/params";
import { Observable } from "rxjs/Observable";

@Injectable()
export class DataService {

  constructor( private _httpClient: HttpClient ) { }

  fetchData( {
               api_url, method = "GET", contentType = "application/json",
               params = null, body = null, responseType = null
             }
               : {
    api_url: string, method?: string, contentType?: string,
    accept?: any,
    params?: HttpParams, body?: any, responseType?: any
  } ): Observable<any> {

    let headers: HttpHeaders = new HttpHeaders();

    headers = headers.append( "Content-Type", contentType );

    const options: { headers?: HttpHeaders, params?: HttpParams, body?: any, responseType?: "json" } = {
      headers: headers,
      params: params,
      body,
      responseType: responseType,
    };

    return this._httpClient.request(
      method,
      api_url, options )
       .pipe(
         map( ( response: HttpResponse<{ response: string, status: string, data: Object }> ) => {
           if ( <any>response.status === "success" ) {
             return { data: response["data"] || response["message"] };
           } else if ( <any>response.status === "error" ) {
             return { errors: response["data"]["errors"] };
           }
         } ),
         shareReplay(),
       );
  }
}

