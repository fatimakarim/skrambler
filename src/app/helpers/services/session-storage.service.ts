import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class SessionStorageService {

  constructor( private localStorageService: LocalStorageService ) {
    if ( this.localStorageService.getLocalStorageLength() > 0 ) {
      // this.storeLocalStorageInSessionStorage();
    }
  }

  get(key: string): any {
    return this.getDataInSessionStorage(key);
  }

  set({key, value}): void {
    this.setDataInSessionStorage({key, value});
  }

  setDataInSessionStorage( { key, value } ): void {
    sessionStorage.setItem( key, JSON.stringify( value ) );
  }

  getDataInSessionStorage( key: string ): any {
    return JSON.parse( sessionStorage.getItem( key ) );
  }

  removeDataFromSessionStorage(key: string): void {
    sessionStorage.removeItem(key);
  }

  cleatDataInSessionStorage(): void {
    sessionStorage.clear();
  }

  getToken(): any {
    return this.getDataInSessionStorage( 'skrambler_token' );
  }

  storeLocalStorageInSessionStorage(): void {
    for ( let i = 0; i < localStorage.length; i++ ) {
      this.setDataInSessionStorage( {
        key: localStorage.key( i ),
        value: JSON.parse( localStorage.getItem( localStorage.key( i ) ) ),
      } );
    }
  }
}
