import { Component, OnInit, Input, SimpleChanges, SimpleChange, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { CampaignService }  from '../../_services/campaign.service'
import { Entity } from '../../_models/entity'
import { Relationship } from 'src/app/_models/relationship';

export interface DialogData {
  srcName:string, relationship:string, destName:string
}

@Component({
  selector: 'app-relationship',
  templateUrl: './relationship.component.html',
  styleUrls: ['./relationship.component.css']
})
export class RelationshipComponent implements OnInit {
  @Input() relationship: Relationship;
  destEntity:Entity;
  srcEntity:Entity;
  @Input() entity;
  isSrc:boolean;
  isDest:boolean;

  constructor(private _campaign:CampaignService, public dialog:MatDialog) {

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
      this._campaign.getEntity(this.relationship.dest).subscribe(e=>{this.destEntity=e});
    }

    if(this.entity.id == this.relationship.src){
      this.srcEntity = this.entity;
      this.isSrc=true;
    } else {
      this._campaign.getEntity(this.relationship.src).subscribe(e=>{this.srcEntity=e});
    }

  }

  editRelationship(){
    const dialogRef = this.dialog.open(EditRelationshipDialog, {
      width: '400px;',
      data:{srcName:this.srcEntity.name, destName:this.destEntity.name, relationship:this.relationship.relationship}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('the dialog was closed');
      //this.relationship.relationship = result;
      if(result){
        if(result.swapped){
          this._campaign.swapRelationship(this.relationship.id, this.relationship.dest, this.relationship.src)
        }
        this._campaign.updateRelationship(this.relationship.id, result.relationship);
      }
    })
  }

  deleteRelationship(){
    this._campaign.deleteRelationship(this.relationship.id);
  }

}


@Component({
  selector: 'edit-relationship-dialog',
  template: `
  <h1 mat-dialog-title> Edit relationship</h1>
  <div mat-dialog-content>
  {{swapped?data.destName:data.srcName}}
    <mat-form-field>
      <input matInput [(ngModel)]="data.relationship">
    </mat-form-field>
    {{swapped?data.srcName:data.destName}}
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">Cancel</button>
    <button mat-button (click)='swapped = !swapped'>Swap</button>
    <button mat-button [mat-dialog-close]="{'swapped':swapped, relationship:data.relationship}"cdkFocusInitial>Ok</button>
  </div>
  `
})
export class EditRelationshipDialog {
  constructor(
    public dialogRef: MatDialogRef<EditRelationshipDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
    swapped = false;
    onSwapClick():void {
      this.swapped = true;
    }
    onNoClick():void {
      this.dialogRef.close();
    }

}
