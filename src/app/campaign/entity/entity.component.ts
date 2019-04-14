import { Component, OnInit, Input, Inject, SimpleChanges, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Entity } from '../../_models/entity'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { CampaignService }  from '../../_services/campaign.service'
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Relationship } from 'src/app/_models/relationship';
import { Note } from 'src/app/_models/note';
import { NotExpr } from '@angular/compiler';

export interface DialogData {
  srcEntity:Entity, availableRelationships:string[], entities:Entity[]
}

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent implements OnInit {
  @Input() entity:Entity;
  @Input() entities:Entity[];
  @ViewChild('tags') tagInput:ElementRef;
  @ViewChild('subtitle') subtitleInput:ElementRef;
  @ViewChild('name') nameInput:ElementRef;
  @ViewChild('desc') descInput:ElementRef;
  @ViewChild('image') imageInput:ElementRef;
  @ViewChild('noteInput') noteInput:ElementRef;
  ///@ViewChildren('note') noteInputs:QueryList<ElementRef>;

 // entities:Entity[];
  relationshipsIn:Relationship[];
  relationshipsOut:Relationship[];
  relationshipsIn$:Observable<Relationship[]>;
  relationshipsOut$:Observable<Relationship[]>;
  notes:Note[];

  editing:string;
  availableRelationships = ["knows", "owns", "is a member of"]
  tagEdit:string;
  notesSub:Subscription = new Subscription();
  relationshipsInSub:Subscription = new Subscription();
  relationshipsOutSub:Subscription = new Subscription();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  chipsRemovable = true;
  constructor(private router: Router,  private route: ActivatedRoute, private _campaign:CampaignService, public dialog:MatDialog) {
    //_campaign.getEntities().subscribe(entities=>this.entities = entities);

  }

  ngOnInit() {
  }
  ngOnChanges(changes:SimpleChanges){
    console.log(changes)
    if(changes.entity){
      if(!changes.entity.previousValue || changes.entity.currentValue.id !== changes.entity.previousValue.id){
        console.log("new entity", this.entity);
        //this.relationshipsInSub.unsubscribe();
        //this.relationshipsOutSub.unsubscribe();
        this.relationshipsOut = [];
        this.relationshipsIn = [];
        console.log(this.relationshipsIn);
        console.log(this.relationshipsOut);
        this.relationshipsInSub = this._campaign.getRelationships(this.entity, "src").subscribe(rels=>{console.log(rels);this.relationshipsIn=rels});
        this.relationshipsOutSub = this._campaign.getRelationships(this.entity, "dest").subscribe(rels=>{console.log(rels);this.relationshipsOut=rels});
        this.notesSub.unsubscribe();
        this.notesSub = this._campaign.getNotes(this.entity).subscribe(notes => this.notes = notes);
        this._campaign.updateEntityTouched(this.entity);
     }

    }
  }
  

  addNote(){
    this._campaign.addNote(this.entity).then((doc)=>{
      const note = this.notes.find(n => n.id === doc.id);
      note.editing = true;
      this.clickEditNote(note); 
    });
  }



  togglePin(){
    this.entity.pin = !this.entity.pin;
    this._campaign.updateEntityPin(this.entity.id, this.entity.pin);
  }
  deleteEntity(){
    for(const rel of this.relationshipsIn){
      this._campaign.deleteRelationship(rel.id);
    }
    for(const rel of this.relationshipsOut){
      this._campaign.deleteRelationship(rel.id);
    }
    this._campaign.deleteEntity(this.entity.id);
    this.router.navigate(['../none'], {relativeTo: this.route});
  }

  createRelationship(){
    // this._campaign.addRelationship(this.entity, this.relationshipCtrl.value, this.relationshipEntity);
    // this.entityCtrl.reset();
    // this.relationshipCtrl.reset();
    // this.relationshipEntity = null;
  }
  deleteRelationship(relationship){
    this._campaign.deleteRelationship(relationship.id);
  }

  getEntityById(id:string):Entity{
    return this.entities.find(e=>e.id===id);
  }



  generateKeys(obj):string[]{
    return obj ? Object.keys(obj) : null;
  }

  countTags(entity:Entity): number{
    let count = 0;
    for(const tag of this.generateKeys(entity.tags)){
      if(entity.tags[tag]){
        count++;
      }
    }
    return count;
  }

  clickDoneName(){
    this.unEdit();
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
    this.unEdit();
    this.editing = 'name';
    setTimeout(() => {
      this.nameInput.nativeElement.focus();
    }, 100)
  }
  clickDoneSubtitle(){
    this.unEdit();
    this._campaign.updateEntitySubtitle(this.entity.id, this.entity.subtitle);
  }

  showCreateRelationship(){
    const dialogRef = this.dialog.open(CreateRelationshipDialog, {
      width: '400px;',
      data:{srcEntity:this.entity, availableRelationships:this.availableRelationships, entities:this.entities}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('the dialog was closed');
      //this.relationship.relationship = result;
      if(result){
        console.log(result);
      }
    })
  }

  clickEditSubtitle(){
    this.unEdit();
    this.editing = 'subtitle';
    setTimeout(() => {
      this.subtitleInput.nativeElement.focus();
    }, 100)
  }
  clickDoneImage(){
    this.unEdit();
    this._campaign.updateEntityImage(this.entity.id, this.entity.image);
  }

  clickEditImage(){
    this.unEdit();
    this.editing = 'image';
    setTimeout(() => {
      this.imageInput.nativeElement.focus();
    }, 100)
  }


  clickDoneDesc(){
    this.unEdit();
    this._campaign.updateEntityDescription(this.entity.id, this.entity.description);
  }

  clickEditDesc(){
    this.unEdit();
    this.editing = 'description';
    setTimeout(() => {
      this.descInput.nativeElement.focus();
    }, 100)
  }
  clickEditTags(){
    this.unEdit();
    this.editing = 'tags';
    setTimeout(() => {
      this.tagInput.nativeElement.focus();
    }, 100)
    
  }

  clickEditNote(note:Note){
    this.unEdit();
    note.editing = true;
    setTimeout(() => {
      this.noteInput.nativeElement.focus();
    }, 100)
  }

  clickDoneNote(note:Note){
    this.unEdit();
    note.editing = false;
    this._campaign.updateNote(this.entity, note)
  }
  clickDeleteNote(note:Note){
    this._campaign.deleteNote(this.entity, note);
  }

  clickCard(event){
    console.log(event);
  }

  unEdit(){
    this.editing = 'none'
    for(let note of this.notes){
      note.editing = false;
    }
  }

}

@Component({
  selector: 'create-relationship-dialog',
  template: `
  <h1 mat-dialog-title>Create Relationship to {{data.srcEntity.name}}</h1>
  <div mat-dialog-content>

          <mat-form-field style="width:100%">
            <mat-label>Relationship</mat-label>
            <input matInput [(ngModel)]="relationship">
            <button mat-button *ngIf="relationship" matSuffix mat-icon-button
              (click)="relationship=''">
              <mat-icon>close</mat-icon>
            </button>
            
          </mat-form-field>

          <form>
          <mat-form-field style="width:100%">

            <input matInput [matAutocomplete]="auto" placeholder="Other" [formControl]="entityCtrl" (input)="onEntityChange($event.target.value)">
            <button mat-button *ngIf="entityCtrl.value" matSuffix mat-icon-button
              (click)="entityCtrl.reset();relationshipEntity=null">
              <mat-icon>close</mat-icon>
            </button>
            <mat-autocomplete #auto="matAutocomplete">
              <mat-option *ngFor="let e of filteredEntities | async" [value]="e.name"
                (onSelectionChange)="changedRelationshipEntity($event, e)">
                <span>{{e.name}}</span>
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>
        </form>
        <div *ngIf="relationship && entityCtrl.value && entityCtrl.value.length>0">
        <h4 >"
        {{!swapped?data.srcEntity.name:relationshipEntity?relationshipEntity.name:entityCtrl.value+'*'}}
        {{relationship}} 
        {{swapped?data.srcEntity.name:relationshipEntity?relationshipEntity.name:entityCtrl.value+'*'}}"</h4>
        <h4 *ngIf='!relationshipEntity'>* A new entity will be created</h4>
        </div>
   </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">CANCEL</button>
    <button mat-button (click)="swapped=!swapped">SWAP</button>
    <button mat-button [disabled]="!relationship || !entityCtrl.value || entityCtrl.value.length==0"
      (click)="onOkClick()"
      cdkFocusInitial>OK</button>
  </div>
  `
})
export class CreateRelationshipDialog {
  relationship:string = "is related to";
  filteredEntitiesActual:Entity[];
  filteredEntities: Observable<Entity[]>;
  entityCtrl:FormControl;
  // filteredRelationships: Observable<string[]>;
  // relationshipCtrl:FormControl;
  swapped = false;
  relationshipEntity:Entity;
  constructor(
    private _campaign:CampaignService,
    public dialogRef: MatDialogRef<CreateRelationshipDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      
      this.entityCtrl  = new FormControl();
      this.filteredEntities = this.entityCtrl.valueChanges
        .pipe(
          startWith(''),
          map(entity=>  entity? this.filterEntities(entity) : this.data.entities.slice()
          )
        );
  
    //  this.relationshipCtrl  = new FormControl();
    //  this.relationshipCtrl.setValue("is related to");
    //  this.filteredRelationships = this.relationshipCtrl.valueChanges
    //    .pipe(
    //      startWith(''),
    //      map(rel=>rel? this.filterRelationships(rel) : data.availableRelationships.slice())
    //    );
      
       this.filteredEntities.subscribe(entities => this.filteredEntitiesActual = entities)
      }
    onSwapClick():void {
      this.swapped = true;
    }
    onNoClick():void {
      this.dialogRef.close();
    }
    onOkClick():void {
      if(this.relationshipEntity){
        if(this.swapped){
          this._campaign.addRelationship(this.relationshipEntity, this.relationship, this.data.srcEntity);
        } else {
          this._campaign.addRelationship( this.data.srcEntity,  this.relationship, this.relationshipEntity);
        }
        
      } else {
        const entity:Entity = {
          name:this.entityCtrl.value,
          created_at:new Date(),
          updated_at:new Date(),
          touched_at:new Date(),
          tags:{},
          subtitle:"",
          description:"",
          pin:false,
          image:null
        };
        this._campaign.addEntity(entity).then((docRef)=>{
          entity.id=docRef.id;
          if(this.swapped){
            this._campaign.addRelationship(entity, this.relationship, this.data.srcEntity);
          } else {
            this._campaign.addRelationship( this.data.srcEntity,  this.relationship, entity,);
          }
        })
      }
      this.dialogRef.close();
    }
    closeCreateRelationship(){
      this.entityCtrl.reset();
      this.relationship = "";
      this.relationshipEntity = null
      // this._campaign.addRelationship(this.entity, this.relationshipCtrl.value, this.relationshipEntity);
      // this.entityCtrl.reset();
      // this.relationshipCtrl.reset();
      // this.relationshipEntity = null;
    }
    filterEntities(name: any):Entity[] {
      return this.data.entities.filter(entity =>
      entity.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }
    changedRelationshipEntity(event, entity:Entity){
      if(event.source.selected){
        this.relationshipEntity = entity;
      }
    }

    onEntityChange(entityText){
      console.log(entityText);
      this.relationshipEntity = null;
      for(const entity of this.filteredEntitiesActual){
        if(entity.name.toLowerCase() === entityText.toLowerCase()){
          this.relationshipEntity = entity
        }
      }
    }
    
  filterRelationships(relationship: string):string[] {
    return this.data.availableRelationships.filter(rel =>
    rel.toLowerCase().indexOf(relationship.toLowerCase()) === 0);
  }

}
