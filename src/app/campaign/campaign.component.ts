import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CampaignService } from '../_services/campaign.service';
import { Entity } from '../_models/entity'
import { EntityComponent } from './entity/entity.component';
import { EntityMiniComponent } from './entity-mini/entity-mini.component';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import {MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css']
})
export class CampaignComponent implements OnInit {
  @ViewChild('sidenav') public sidenav:any;
  entities:Observable<Entity[]>;
  entity:Entity;
  campaignId:string;
  entityId:string;
  entityForm: FormGroup;
  filterName:string;
  creatingEntity:boolean = false;
  private defaultTags:string[] = ["character","group", "location", "item", "objective"];
  campaignTags:string[] = [];
  mobileQuery: MediaQueryList;
  tagsSelect:string[] = [];

  private _mobileQueryListener: ()=>void;
  constructor(private router: Router, private route: ActivatedRoute, private _campaign: CampaignService, private fb: FormBuilder, changeDetectorRef:ChangeDetectorRef, media:MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this._campaign.sidnavToggle$.subscribe(res=>{this.sidenav.toggle()});
    this.entityForm = fb.group({
      name: [null, Validators.required],
      subtitle: [null, Validators.required],
      description: [""],
      type:[null, Validators.required]
    })
    route.paramMap.subscribe(params => {
      const campaignId = params.get('campaign');
      const entityId = params.get('entity');
      console.log(campaignId, entityId);
      if(this.campaignId != campaignId){
        this.campaignId = campaignId;
        _campaign.setCampaignId(campaignId);
        this.entities = _campaign.getEntities();
        this.entities.subscribe(entityList=>{
          this.buildTagList(entityList);
        });
        console.log('new campaign id', campaignId);
      }1
      if(entityId != this.entityId){
        console.log('new entity id', entityId);
        //this._campaign.updateEntityTouched(entityId);
        this.entityId = entityId;
        _campaign.setEntityId(entityId);
        _campaign.getEntity(entityId).subscribe(entity => {
          console.log("_campaign.getEntity() triggered")
          this.entity = entity;
        });
      }
    });

   }

  ngOnInit() {
  }
  ngOnDestroy():void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  rebuildForm() {
    this.entityForm.reset();
  }

  onFormSubmit(){
    const formModel = this.entityForm.value;
    var tagsObject = {};
    var tagName = formModel.type as string;
    tagsObject[tagName] = true;
    console.log(tagsObject);
    const entity:Entity = {
      name:formModel.name as string,
      created_at:new Date(),
      updated_at:new Date(),
      touched_at:new Date(),
      tags:tagsObject,
      subtitle:formModel.subtitle as string,
      description:formModel.description as string,
      pin:false
    };

    var ret = this._campaign.addEntity(this.campaignId, entity);
    ret.then(docRef => {
      this.router.navigate(['campaign/'+this.campaignId+'/'+docRef.id]);
    });
    console.log(ret);
    this.rebuildForm();
  }

  filterEntityList(e:Entity):boolean{
    var matchesName:boolean = false;
    var matchesTags:boolean = true;
    if(!this.filterName){
       matchesName = true;
    } else {
      if( e.name.toLowerCase().indexOf(this.filterName.toLowerCase()) >=0){
        matchesName = true;
      }
    }
    if(this.tagsSelect === undefined || this.tagsSelect.length == 0){matchesTags = true;}
      else {
        matchesTags = this.entityHasATag(e);
      }
    return matchesName && matchesTags;

  }

  entityHasATag(e:Entity){
    if(!e.tags) return false;
    for(let tag of this.tagsSelect){
      if(e.tags[tag]) return true;
    }
    return false;
  }

  linkEntity(e:Entity){
    console.log("Linking entity!", e);
    this._campaign.addRelationship(this.entity, "relates to", e);
  }

  buildTagList(entityList:Entity[]){
    //generate list of tags
    this.campaignTags = this.defaultTags;
    for(let entity of entityList){
      console.log(entity.tags);
      if(entity.tags){
        for (let tag of Object.keys(entity.tags)){
          if(entity.tags[tag]){
            this.campaignTags.push(tag);
          }
        }
      }
    }
  }



}
