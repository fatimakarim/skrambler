export class Role {
    public id: number;
    public slug: string;
    constructor(values: Object = {}) {
        if (values) {
          Object.assign(this, values);
        }
      }
}