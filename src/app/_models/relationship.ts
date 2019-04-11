export interface Relationship {
  id?:string;
  src: string;
  dest:string;
  relationship:string;
}
export interface RelationshipId extends Relationship { id: string; }
