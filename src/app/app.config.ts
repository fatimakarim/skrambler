import {Injectable} from "@angular/core";

@Injectable()
export class AppConfig {

  config = {
    name: "GPulseAdminPanel",
    title: "GATEPULSE",
    version: "1.0.0",

    apiUrl: {
      backendUrl: "https://backend-stg.myskrambler.com/",
    }
  };

  constructor() {
  }

  getConfig(): Object {
    return this.config;
  }
}

