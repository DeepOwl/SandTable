export interface Note {
    id?:string;
    user?:any;
    text:string;
    editing?:boolean;
  }
  export interface NoteId extends Note { id: string; }
  