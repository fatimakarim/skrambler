import { BaseModel } from "../../../../helpers/models/BaseModel";
import { Brand } from "../../brands/models/Brand";

export class Dashboard extends BaseModel {
    brand: Brand

    constructor(values: Object = {}) {
        super();
        if (values) {
          Object.assign(this, values);
        }
        this.brand = new Brand();
      }
}
