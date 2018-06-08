import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CampaignService } from '../_services/campaign.service';
import { Entity } from '../_models/entity'
import { EntityComponent } from './entity/entity.component';
import { EntityMiniComponent } from './entity-mini/entity-mini.component';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';


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
  entityForm: FormGroup;
  constructor(private router: Router, private route: ActivatedRoute, private _campaign: CampaignService, private fb: FormBuilder) {
    this.entityForm = fb.group({
      name: [null, Validators.required],
      subtitle: [null, Validators.required],
      description: [null, Validators.required]
    })
    route.paramMap.subscribe(params => {
      const campaignId = params.get('campaign');
      const entityId = params.get('entity');
      console.log(campaignId, entityId);
      if(this.campaignId != campaignId){
        this.campaignId = campaignId;
        _campaign.setCampaignId(campaignId);
        this.entities = _campaign.getEntities(campaignId);
        console.log('new campaign id', campaignId);
      }
      if(entityId != this.entityId){
        console.log('new entity id', entityId);
        this.entityId = entityId;
        _campaign.setEntityId(entityId);
        _campaign.getEntity(campaignId, entityId).subscribe(entity => {
          this.entity = entity;
        });
      }
    });

   }

  ngOnInit() {
  }

  rebuildForm() {
    this.entityForm.reset();
  }

  onFormSubmit(){
    const formModel = this.entityForm.value;
    const entity:Entity = {
      name:formModel.name as string,
      created_at:new Date(),
      updated_at:new Date(),
      subtitle:formModel.subtitle as string,
      description:formModel.description as string,
      relationships:[]};

    var ret = this._campaign.addEntity(this.campaignId, entity);
    ret.then(docRef => {
      this.router.navigate(['../'+docRef.id], {relativeTo: this.route});
    });
    console.log(ret);
    this.rebuildForm();
  }


}
