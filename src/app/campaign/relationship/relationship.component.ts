import { Component, OnInit, Input, SimpleChanges, SimpleChange} from '@angular/core';
import { CampaignService }  from '../../_services/campaign.service'
import { Entity } from '../../_models/entity'

@Component({
  selector: 'app-relationship',
  templateUrl: './relationship.component.html',
  styleUrls: ['./relationship.component.css']
})
export class RelationshipComponent implements OnInit {
  @Input() relationship: {id:string, dest:string, relationship:string, src:string};
  destEntity:Entity;
  srcEntity:Entity;
  @Input() entity;
  isSrc:boolean;
  isDest:boolean;

  constructor(private _campaign:CampaignService) {

  }

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges){
    console.log("relationship OnChanges")
    this.isDest=false;
    this.isSrc=false;
    if(this.entity.id == this.relationship.dest){
      this.destEntity = this.entity;
      this.isDest=true;
    } else {
      this._campaign.getEntity(this.relationship.dest).subscribe(e=>{console.log("relationship._campaign.getEntity()");this.destEntity=e});
    }

    if(this.entity.id == this.relationship.src){
      this.srcEntity = this.entity;
      this.isSrc=true;
    } else {
      this._campaign.getEntity(this.relationship.src).subscribe(e=>{console.log("relationship._campaign.getEntity()");this.srcEntity=e});
    }
    if(this.isDest && this.isSrc){
      console.log(this.entity, this.relationship)
    }
  }


  deleteRelationship(){
    this._campaign.deleteRelationship(this.relationship.id);
  }

}
