export interface Entity {
  id?:string;
  created_at:Date;
  updated_at:Date;
  touched_at:Date;
  tags:{
    [key:string]:boolean
  };
  name:string;
  subtitle?:string;
  description?:string;
  relationships?:any[];
  pin:boolean;
  image:string;
}
