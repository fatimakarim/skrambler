// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    hmr       : false,
    backendUrl: "https://backend-stg.myskrambler.com/", // "http://localhost/feed/feed-backend/",//"https://stg-api.feed-app.com/", //"https://uat-api.feed-app.com/",
    frontendUrl: "https://frontend-stg.myskrambler.com/",
};
