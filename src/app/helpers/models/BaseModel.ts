export class BaseModel {
  public id: string | number;
  public business_reference_id?: string;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;
  public active: number | boolean = 1;

  /**
   * the following method is used to map the incoming values to the current instance
   * @param values 
   */
  mapValues(values){
    if (values) {
      Object.assign(this, values);
    }
  }
}
