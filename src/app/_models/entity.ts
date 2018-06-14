export interface Entity {
  id?:string;
  created_at:Date;
  updated_at:Date;
  name:string;
  subtitle?:string;
  description?:string;
  relationships?:any[];
}
