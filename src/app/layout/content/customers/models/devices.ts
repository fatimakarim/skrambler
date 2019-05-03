export class Devices {
    id: number;
    type: string;
    version: string;
    uuid: string;
    active: number;
    user_id: number;
    locale: string;
    last_access: string;
    deleted_at: string;
    constructor(values: Object = {}) {
        if (values) {
          Object.assign(this, values);
        }
      }
}
