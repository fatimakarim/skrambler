"use strict";
import { environment } from "environments/environment";

const environmentConfig = environment;

export const SERVER_URL: string = environmentConfig.backendUrl;

// GENERIC Constants
export const DEFAULT_SNACKBAR_DURATION = 3000;
export const DEFAULT_LONGITUDE: any = -98.5795;
export const DEFAULT_LATITUDE: any = 39.8282;
export const DEFAULT_REDIRECTION_WAIT_TIME = 3000;
export const DEFAULT_REQUEST_LONG_TIME_INTERVAL = 3000;
export const DEFAULT_DEBOUNCE_TIME = 200;
export const DEFAULT_SCROLL_DELAY_TIME = 500;
export const DEFAULT_SCROLL_OFFSET = 1000;
export const DEFAULT_LOGO_SIZE_BYTES = 2097152;
export const DEFAULT_SNACKBAR_LABEL = "OK";
export const DEFAULT_REMEMBER_ME_MONTHS = 2;
export const DEFAULT_SESSION_HOURS = 1;
export const DEFAULT_SORT_KEY = "createdAt";
export const DEFAULT_SORT_ORDER = "DESC";
export const DEFAULT_REQUEST_TOO_LONG_TEXT = "Your request is in progress. Don't go away!";
export const DEFAULT_INVALID_TOKEN_SERVER_RESPONSE = "Token not provided";
export const DEFAULT_INVALID_TOKEN_SIGNATURE_SERVER_RESPONSE = "Token Signature could not be verified.";
export const DEFAULT_COOKIE_ENCRYPTION_KEY = "pxMqZPuwWVyFFfCKDxXB09kgbJNdSkE0";
export const SEARCH = "search";
export const POP_UP_LARGE_WIDTH = "60%";
export const DEFAULT_UPLOAD_ICON = "/assets/images/logos/ic-upload.png";
export const DEFAULT_FLOOR_MAP_SLOT_COLOR = "#E72E74";
export const DEFAULT_ERROR_MESSAGE = "Server rejected your request. Please try again!";
export const FORM_FIELD_APPREANCE = "legacy";
export const DEFAULT_ZOOM_LEVEL = 16;
export const DEFAULT_IMAGE_WIDTH = 1024;
export const DEFAULT_IMAGE_HEIGHT = 768;

// Http Headers Constants
export const X_DEVICE_ID = "2";
export const X_DEVICE_UUID = "browser";
// Status Constant
export const STATUS = "status";
export const STATUS_BOTH = "";
export const STATUS_AVAILABLE = "1";
export const STATUS_OFFLINE = "1";
export const ResponseSuccess = "1";

// LOGIN page constants
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH: number = 18;
export const NAME_MAX_LENGTH = 50;
export const DESCRIPTION_MAX_LENGTH = 250;
export const MOBILE_NUMBER_MIN_LENGTH = 6;
export const MAX_AUTO_SIZE_MIN_ROWS = 5;
export const MAX_AUTO_SIZE_MAX_ROWS = 10;
export const ACCOUNT_STATUS_ACTIVE = "active";
export const ACCOUNT_STATUS_PENDING = "pending";
export const POP_UP_DEFAULT_WIDTH = "500px";
export const NUMBER_RECORDS_PER_PAGE = 15;
export const DEFAULT_PAGE_INDEX = 0;
export const SUCCESS_RESPONSE = 200;
export const SUCCESS_STATUS = "success";
export const FAILURE_RESPONSE = "0";
export const FAILURE_STATUS = "error";
export const VALID_FORM_STATE = "VALID";
export const DISABLED_FORM_STATE = "DISABLED";

// ACCOUNT Constants
export const INACTIVE_ACCOUNT = 0;
export const ALL_ACCOUNT_STATUS = 0;
export const ACTIVE_ACCOUNT_STATUS = 1;
export const INACTIVE_ACCOUNT_STATUS = 2;
export const REJECTION_ACCOUNT_STATUS = 3;
export const PENDING_ACCOUNT_STATUS = 4;
export const RESET_PASSWORD_CONFIRMATION_MESSAGE = "An email has been sent to the user";

// User Constant
export const NUMBER_USER_STATUS_ACTIVE = 1;
export const STRING_USER_STATUS_ACTIVE = "Active";
export const NUMBER_USER_STATUS_INACTIVE = 2;
export const STRING_USER_STATUS_INACTIVE = "Inactive";
export const NUMBER_USER_STATUS_REJECTED = 3;
export const STRING_USER_STATUS_REJECTED = "Rejected";
export const STRING_USER_STATUS_PENDING = "Pending";

// Role Constants
export const ADMIN_ROLE = "admin";
export const SUPPER_ADMIN_ROLE = "super-admin";
export const BRAND_OWNER_ROLE = "brand-owner";
export const SUPPORT_TEAM_ROLE = "support team";
export const BRAND_MANAGER_ROLE = "brand manager";
export const LANDLORD_ROLE = "land lord";

// Event Constants
export const ALL_EVENTS_TYPE = 0;
export const RECCURING_EVENT_TYPE = 1;
export const ONE_TIME_EVENT_TYPE = 2;
export const DIFFERENCE_BETWEEN_PUBLISH_END_DATE = 7;


// Brand Category
export const BRAND_FOOD_DRINKS_ID = 4;
export const DELIVERY_TYPES: any[] = [
  { delivery_type_id: 1, viewValue: "Dine in", description: "", placeholder: "Dine in Description" },
  { delivery_type_id: 2, viewValue: "Takeaway", description: "", placeholder: "Takeaway Description" },
  { delivery_type_id: 3, viewValue: "Delivery", description: "", placeholder: "Delivery Description" },
];
// YEARS CONSTANT
export const DEFAULT_YEARS: any[] = [
  { value: "2018", viewValue: "2018" },
  { value: "2019", viewValue: "2019" },
  { value: "2020", viewValue: "2020" },
  { value: "2021", viewValue: "2021" },
  { value: "2022", viewValue: "2022" },
  { value: "2023", viewValue: "2023" },
  { value: "2024", viewValue: "2024" },
  { value: "2025", viewValue: "2025" },
  { value: "2026", viewValue: "2026" },
  { value: "2027", viewValue: "2027" },
  { value: "2028", viewValue: "2028" },
  { value: "2029", viewValue: "2029" },
  { value: "2030", viewValue: "2030" },
];

// GENERIC ENUMS
export const STATUSES: Object[] = [
  {
    value: 1, name: "ACTIVE",
  }, {
    value: 0, name: "INACTIVE",
  }
];


export const CUSTOMER_STATUSES: Object[] = [
  {
    value: 5, name: "TBC (To be confirmed)",
  }, {
    value: 4, name: "PENDING",
  }, {
    value: 1, name: "APPROVED",
  }, {
    value: 2, name: "BLOCKED",
  }
];

export const CUSTOMER_ACCOUNT_STATUSES: Object[] = [
  {
    value: ACTIVE_ACCOUNT_STATUS, name: "APPROVED",
  }, 
  {
    value: INACTIVE_ACCOUNT_STATUS, name: "BLOCKED",
  },
  {
    value: PENDING_ACCOUNT_STATUS, name: "PENDING",
  }
];

export const GENDER: object[] = [
  {
    value: "Male", name: "Male",
  }, {
    value: "Female", name: "Female",
  }
];

export const GENDER_CRITIRIA: object[] = [
  {
    value: "Male", name: "Male",
  }, {
    value: "Female", name: "Female",
  }
  , {
    value: "Both", name: "Male & Female Both",
  }
];

export const AGE_RANGE: object[] = [
  {
    value: 2, name: "Above 21",
  }, {
    value: 1, name: "Under 21",
  }
];

export const AGE_LIMIT: object[] = [
  { value: "14", viewValue: "14" },
  { value: "15", viewValue: "15" },
  { value: "16", viewValue: "16" },
  { value: "17", viewValue: "17" },
  { value: "18", viewValue: "18" },
  { value: "19", viewValue: "19" },
  { value: "20", viewValue: "20" },
  { value: "21", viewValue: "21" },
  { value: "22", viewValue: "22" },
  { value: "23", viewValue: "23" },
  { value: "24", viewValue: "24" },
];

export const AGE_LIMIT_FILTER: object[] = [
  { value: 14, name: "14" },
  { value: 15, name: "15" },
  { value: 16, name: "16" },
  { value: 17, name: "17" },
  { value: 18, name: "18" },
  { value: 19, name: "19" },
  { value: 20, name: "20" },
  { value: 21, name: "21" },
  { value: 22, name: "22" },
  { value: 23, name: "23" },
  { value: 24, name: "24" },
];
export const USER_TYPE: Object[] = [
{value : 0, name: "Normal Users"},
{value : 1, name: "Ambassadors"}
];

export const PROFILE_IMAGE: Object[] = [
  {value : 0, name: "Without profile picture"},
];
export const CAMPAIGN_TYPES: Object[] = [
  {value : "1", name: "Impression"},
  {value : "2", name: "Duration campaigns"}
  ];

export const ROLES: Object[] = [
  {
    "value": 1,
    "slug": "admin",
    "users_count": null,
    "name": "Admin"
  },
  {
    "value": 2,
    "slug": "brand-owner",
    "users_count": null,
    "name": "Brand Owner"
  }, {
    "value": 4,
    "slug": "super-admin",
    "users_count": null,
    "name": "Super Admin"
  },
  // {
  //   "value": 3,
  //   "slug": "app-user",
  //   "users_count": null,
  //   "name": "App User"
  // },
];

// Roles constants
export const SKRAMBLER_ADMIN_ROLE_ID = 1;
export const SKRAMBLER_BRAND_OWNER_ROLE_ID = 2;
export const SKRAMBLER_SUPER_ADMIN_ROLE_ID = 4;

// Permission Constant
export const PERMISSION_READ = "read";
export const PERMISSION_WRITE = "write";

// BRAND Constants
export const BRAND_MAIN_IMAGE_TYPE = 1;
export const BRAND_LOGO_IMAGE_TYPE = 2;
export const BRAND_SECONDARY_IMAGE_TYPE = 3;
export const BRAND_IMAGE_SIZE = 2097152;
export const DEFAULT_COVER_PHOTO_ASPECT_RATIO: number = 1 / 1;
export const DEFAULT_IMAGE_PHOTO_ASPECT_RATIO: number = 16 / 9;
export const DEFAULT_PHOTO_ALBUM_LENGTH = 10;

// FEATURED CAMPAIGN Constants
export const CAMPAIGN_MAIN_IMAGE_TYPE = 1;

// CUSTOMER Constants
export const PROFILE_IMAGE_TYPE = 0;
export const NATIONAL_CARD_FRONT_IMAGE_TYPE = 1;
export const NATIONAL_CARD_BACK_IMAGE_TYPE = 2;
export const IDCARD_IMAGE_SIZE = 2097152;

// OFFER constants
export const OFFER_TYPES: any[] = [
  { name: "Discount Purchase on Purchase Total", id: 1 },
  { name: "Discount on Specific Item", id: 2 },
  { name: "Spending $X and get a Percentage discount on total Purchase", id: 3 },
  { name: "Spending $X and get an item free", id: 4 },
  { name: "Buy X, get X free", id: 5 },
  { name: "Buy X get Y discounted", id: 6 },
  { name: "Other", id: 7 },
  { name: "Buy X, get Y free", id: 8 },


];
export const OFFER_TYPES_FILTERS: any[] = [
  { name: "Discount Purchase on Purchase Total", value: 1 },
  { name: "Discount on Specific Item", value: 2 },
  { name: "Spending $X and get a Percentage discount on total Purchase", value: 3 },
  { name: "Spending $X and get an item free", value: 4 },
  { name: "Buy X, get X free", value: 5 },
  { name: "Buy X get Y discounted", value: 6 },
  { name: "Other", value: 7 },
  { name: "Buy X, get Y free", value: 8 },


];
export const KIND_OFFER_TYPES: any[] = [
  {name: "Surprise" , id : 1},
  { name: "Standard ", id: 2 },
  {name: "Family & Friends Feast" , id : 3},
  {name: "Loyalty Offer" , id : 4},

];


export const KIND_OFFER_TYPES_FILTER: any[] = [
  {name: "Surprise" , value : 1},
  {name: "Standard ", value: 2 },
  {name: "Family & Friends Feast" , value : 3},
  {name: "Loyalty Offer" , value : 4},

];


export const DEFAULT_DAYS: any[] = [
  { id: 1 , value: "monday", viewValue: "Monday" },
  { id: 2 , value: "tuesday", viewValue: "Tuesday" },
  { id: 3 , value: "wednesday", viewValue: "Wednesday" },
  { id: 4 , value: "thursday", viewValue: "Thursday" },
  { id: 5 , value: "friday", viewValue: "Friday" },
  { id: 6 , value: "saturday", viewValue: "Saturday" },
  { id: 7 , value: "sunday", viewValue: "Sunday" }
];
export const OFFER_TYPE_LOYALTY_ID = 4;
export const OFFER_TYPE_SURPRISE_ID = 1;
export const OFFER_TYPE_FAMILY_ID = 3;


// BRANCH Constants
export const DEFAULT_HOURS: any[] = [
  { value: "00:00", viewValue: "00:00" },
  { value: "00:30", viewValue: "00:30" },
  { value: "01:00", viewValue: "01:00" },
  { value: "01:30", viewValue: "01:30" },
  { value: "02:00", viewValue: "02:00" },
  { value: "02:30", viewValue: "02:30" },
  { value: "03:00", viewValue: "03:00" },
  { value: "03:30", viewValue: "03:30" },
  { value: "04:00", viewValue: "04:00" },
  { value: "04:30", viewValue: "04:30" },
  { value: "05:00", viewValue: "05:00" },
  { value: "05:30", viewValue: "05:30" },
  { value: "06:00", viewValue: "06:00" },
  { value: "06:30", viewValue: "06:30" },
  { value: "07:00", viewValue: "07:00" },
  { value: "07:30", viewValue: "07:30" },
  { value: "08:00", viewValue: "08:00" },
  { value: "08:30", viewValue: "08:30" },
  { value: "09:00", viewValue: "09:00" },
  { value: "09:30", viewValue: "09:30" },
  { value: "10:00", viewValue: "10:00" },
  { value: "10:30", viewValue: "10:30" },
  { value: "11:00", viewValue: "11:00" },
  { value: "11:30", viewValue: "11:30" },
  { value: "12:00", viewValue: "12:00" },
  { value: "12:30", viewValue: "12:30" },
  { value: "13:00", viewValue: "13:00" },
  { value: "13:30", viewValue: "13:30" },
  { value: "14:00", viewValue: "14:00" },
  { value: "14:30", viewValue: "14:30" },
  { value: "15:00", viewValue: "15:00" },
  { value: "15:30", viewValue: "15:30" },
  { value: "16:00", viewValue: "16:00" },
  { value: "16:30", viewValue: "16:30" },
  { value: "17:00", viewValue: "17:00" },
  { value: "17:30", viewValue: "17:30" },
  { value: "18:00", viewValue: "18:00" },
  { value: "18:30", viewValue: "18:30" },
  { value: "19:00", viewValue: "19:00" },
  { value: "19:30", viewValue: "19:30" },
  { value: "20:00", viewValue: "20:00" },
  { value: "20:30", viewValue: "20:30" },
  { value: "21:00", viewValue: "21:00" },
  { value: "21:30", viewValue: "21:30" },
  { value: "22:00", viewValue: "22:00" },
  { value: "22:30", viewValue: "22:30" },
  { value: "23:00", viewValue: "23:00" },
  { value: "23:30", viewValue: "23:30" },
];

export const DEFAULT_DATE_FORMAT: string = "YYYY-MM-DD";
export const DEFAULT_TIME_FORMAT: string = "HH:mm:ss";
export const DEFAULT_DATETIME_FORMAT: string = "YYYY-MM-DD HH:mm:ss";
