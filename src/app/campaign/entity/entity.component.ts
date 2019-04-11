import { Component, OnInit, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { Entity } from '../../_models/entity'
import { RelationshipComponent } from '../relationship/relationship.component'
import { CampaignService }  from '../../_services/campaign.service'
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent implements OnInit {
  @Input() entity:Entity;
  entities:Entity[];
  relationshipsIn:any[];
  relationshipsOut:any[];
  relationshipsIn$:Observable<any[]>;
  relationships$:Observable<any[]>;
  relationshipsOut$:Observable<any[]>;
  //entities:Observable<Entity[]>;
  filteredEntities: Observable<any[]>;
  entityCtrl:FormControl;
  filteredRelationships: Observable<any[]>;
  relationshipCtrl:FormControl;
  relationshipEntity:Entity;
  editing:string;
  availableRelationships = ["knows", "owns", "is a member of"]
  tagEdit:string;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  chipsRemovable = true;
  constructor(private router: Router,  private route: ActivatedRoute, private _campaign:CampaignService) {
    console.log("EntityComponent Constructor")

    _campaign.getEntities().subscribe(entities=>this.entities = entities);
    _campaign.entityChanged$.subscribe(id=>{
    });

    this.entityCtrl  = new FormControl();
    this.filteredEntities = this.entityCtrl.valueChanges
      .pipe(
        startWith(''),
        map(entity=>  entity? this.filterEntities(entity) : this.entities.slice()
        )
      );

   this.relationshipCtrl  = new FormControl();
   this.filteredRelationships = this.relationshipCtrl.valueChanges
     .pipe(
       startWith(''),
       map(rel=>rel? this.filterRelationships(rel) : this.availableRelationships.slice())
     );
  }

  ngOnInit() {
  }
  ngOnChanges(changes:SimpleChanges){
    console.log("entity input changed")
      this.relationshipsIn = [];
      this.relationshipsOut = [];
      
      this.relationshipsIn$ = this._campaign.getRelationships("src");
      this.relationshipsOut$ = this._campaign.getRelationships("dest");
      // this._campaign.getRelationships("src").subscribe(relationships=>{
      //   console.log("entity.relationshipsIn changed");
      //   //this.relationshipsIn = relationships
      // });
      // this._campaign.getRelationships("dest").subscribe(relationships=>{
      //   console.log("entity.relationshipsOut changed");
      //   //this.relationshipsOut = relationships}
      // });
  }
  changedRelationshipEntity(event, entity:Entity){
    console.log('changedRelationshipEntity', event);
    if(event.source.selected){
      this.relationshipEntity = entity;
    }
  }

  filterEntities(name: any):Entity[] {
    return this.entities.filter(entity =>
    entity.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  filterRelationships(relationship: string):string[] {
    return this.availableRelationships.filter(rel =>
    rel.toLowerCase().indexOf(relationship.toLowerCase()) === 0);
  }

  togglePin(){
    this.entity.pin = !this.entity.pin;
    this._campaign.updateEntityPin(this.entity.id, this.entity.pin);
  }
  deleteEntity(){
    this._campaign.deleteEntity(this.entity.id);
    this.router.navigate(['../none'], {relativeTo: this.route});
  }

  createRelationship(){
    this._campaign.addRelationship(this.entity, this.relationshipCtrl.value, this.relationshipEntity);
    this.entityCtrl.reset();
    this.relationshipCtrl.reset();
    this.relationshipEntity = null;
  }
  deleteRelationship(relationship){
    this._campaign.deleteRelationship(relationship.id);
  }

  closeCreateRelationship(){
    this.editing = 'none';
    this.entityCtrl.reset();
    this.relationshipCtrl.reset();
    this.relationshipEntity = null
  }

  generateKeys(obj){
    return obj ? Object.keys(obj) : null;
  }

  clickDoneName(){
    this.editing = 'none';
    this._campaign.updateEntityName(this.entity.id, this.entity.name);

  }

clickDoneTag(value){
  this._campaign.addEntityTag(this.entity.id, value);
}

addTag(event: MatChipInputEvent):void{
  console.log(event);
  const input = event.input;
  const value = event.value;
  if((value || '').trim()){
    this._campaign.addEntityTag(this.entity.id, value);
  }
  if(input){
    input.value = '';
  }
}
removeTag(tag:string):void{
  this._campaign.removeEntityTag(this.entity.id, tag);
}

  clickEditName(){
    this.editing = 'name';
  }
  clickDoneSubtitle(){
    this.editing='none'
    this._campaign.updateEntitySubtitle(this.entity.id, this.entity.subtitle);
  }

  clickEditSubtitle(){
    this.editing = 'subtitle';
  }

  clickDoneDesc(){
    this.editing = 'none';
    this._campaign.updateEntityDescription(this.entity.id, this.entity.description);
  }

  clickEditDesc(){
    this.editing = 'description';
  }

}
