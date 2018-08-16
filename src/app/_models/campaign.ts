export interface Campaign {
  id?:string;
  name:string;
  description:string;
  roles:{
    [key:string]:string
  };
  invite:any;
  created_at:Date;
  updated_at:Date;
  touched_at:Date;
  //showInvite:boolean;
}
export interface CampaignId extends Campaign { id: string; }
