import { Injectable } from "@angular/core";

@Injectable()
export class LocalStorageService {
  get(key: string): any {
    return this.getDataInLocalStorage(key);
  }

  set({ key, value }): void {
    this.setDataInLocalStorage({ key, value });
  }

  setDataInLocalStorage({ key, value }) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getDataInLocalStorage(key: string) {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(localStorage.getItem(key));
    }

    return null;
  }

  clearDataInLocalStorage() {
    localStorage.clear();
  }

  getToken() {
    return this.getDataInLocalStorage("skrambler_token");
  }

  getLocalStorageLength() {
    return localStorage.length;
  }
}

