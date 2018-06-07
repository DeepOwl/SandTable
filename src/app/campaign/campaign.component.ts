import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CampaignService } from '../_services/campaign.service';
import { Entity } from '../_models/entity'
import { EntityComponent } from './entity/entity.component';
import { EntityMiniComponent } from './entity-mini/entity-mini.component';
@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css']
})
export class CampaignComponent implements OnInit {
  entities:Observable<any[]>;
  entity:Entity;
  campaignId:string;
  entityId:string;
  constructor(private route: ActivatedRoute, private _campaign: CampaignService) {
    route.paramMap.subscribe(params => {
      const campaignId = params.get('campaign');
      const entityId = params.get('entity');
      console.log(campaignId, entityId);
      if(this.campaignId != campaignId){
        this.campaignId = campaignId;
        this.entities = _campaign.getEntities(campaignId);
        console.log('new campaign id', campaignId);
      }
      if(entityId != this.entityId){
        console.log('new entity id', entityId);
        this.entityId = entityId;
        _campaign.getEntity(campaignId, entityId).subscribe(entity => {
          this.entity = entity;
        });
      }
    });

   }

  ngOnInit() {
  }

}
