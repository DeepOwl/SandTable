import { Component, OnInit, Input } from '@angular/core';
import { CampaignService }  from '../../_services/campaign.service'
import { Entity } from '../../_models/entity'

@Component({
  selector: 'app-relationship',
  templateUrl: './relationship.component.html',
  styleUrls: ['./relationship.component.css']
})
export class RelationshipComponent implements OnInit {
  @Input() relationship: {dest:string, relationship:string, src:string};
  destEntity:Entity;
  srcEntity:Entity;
  @Input() entity;

  constructor(private _campaign:CampaignService) {

  }

  ngOnInit() {
    if(this.entity.id == this.relationship.dest){
      this.destEntity = this.entity;
    } else {
      this._campaign.getEntity(this.relationship.dest).subscribe(e=>this.destEntity=e);
    }

    if(this.entity.id == this.relationship.src){
      this.srcEntity = this.entity;
    } else {
      this._campaign.getEntity(this.relationship.src).subscribe(e=>this.srcEntity=e);
    }

  }

}
