export interface Entity {
  id?:string;
  created_at:Date;
  updated_at:Date;
  touched_at:Date;
  type:string;
  name:string;
  subtitle?:string;
  description?:string;
  relationships?:any[];
  pin:boolean;
}
