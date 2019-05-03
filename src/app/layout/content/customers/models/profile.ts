export class Profile {
    id: number;
    user_id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    school: string;
    phone: string;
    image: string;
    country: string;
    national_card_front: string;
    national_card_back: string;
    gender: string;
    dob: string;
    status: string | number;
  country_id: string;
    note: string;
    constructor(values: Object = {}) {
        if (values) {
          Object.assign(this, values);
        }
      }
}
