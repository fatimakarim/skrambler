import { Injectable } from "@angular/core";
import { DataService } from "./data.service";

@Injectable()
export class ResourceService<T> {
  private url: string;
  private endpoint: string;
  private method: string;
  private contentType: string;

  constructor(private _dataService: DataService) {}

  setParameters(
    _url: string,
    _endpoint: string,
    _method: string,
    _contentType: string
  ) {
    this.url = _url;
    this.endpoint = _endpoint;
    this.method = _method;
    this.contentType = _contentType;
  }

  public fetch({ params, body }: { params: any; body: any }) {
    let api_url = "";
    if (this.url) {
      api_url += this.url;
    }

    if (this.endpoint) {
      api_url += this.endpoint;
    }

    if (api_url.length) {
      return this._dataService.fetchData({
        api_url: api_url,
        method: this.method,
        contentType: this.contentType,
        params: params,
        body: body
      });
    }
  }
}

export class Resource {
  total: number;
  page: number;
  last_page: number;
  per_page: number;
  items: any;
  has_more = true;
}
