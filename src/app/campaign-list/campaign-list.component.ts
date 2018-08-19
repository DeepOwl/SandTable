import { Component, OnInit, Inject } from '@angular/core';
import { CampaignService } from '../_services/campaign.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Campaign } from '../_models/campaign'

export interface DialogData {
  campaign:Campaign;
}

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.css']
})
export class CampaignListComponent implements OnInit {
  public campaigns: Observable<any[]>;
  public campaignsGuest: Observable<any[]>;
  showInvite:boolean = false;
  inviteCode:string;
  inviteCampaign:Campaign;

  constructor(private _campaign:CampaignService, public dialog:MatDialog) {
    this.campaigns = _campaign.getCampaignList()
    this.campaignsGuest = _campaign.getCampaignListGuest()
    //this.campaigns = db.collection('/campaigns').valueChanges();

  }

  ngOnInit() {
  }

  showInviteCode(campaign:Campaign){
    const dialogRef = this.dialog.open(InviteDialog, {
      width: '500px;',
      data:{campaign:campaign}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('the dialog was closed');
    })
  }

  getCampaign(){
    this._campaign.getCampaignByInviteCode(this.inviteCode).subscribe(campaign=>{
      console.log(campaign)
      this.inviteCampaign = campaign;


  });;
  }

  joinCampaign(){
    this._campaign.joinCampaignByInviteCode(this.inviteCode, this.inviteCampaign.id);
  }

}


@Component({
  selector: 'invite-dialog',
  template: `
  <h1 mat-dialog-title>Invite Code for {{data.campaign.name}}</h1>
  <p mat-dialog-subtitle>Give this code to people you want to have access to this board</p>
  <div mat-dialog-content>
  <mat-form-field style='width:100%'>
  <mat-label>Copy this code</mat-label>
  <input matInput [readonly]='true' type="text" [(ngModel)]='data.campaign.invite' #userinput>

     </mat-form-field>
     </div>
  <div mat-dialog-actions>

    <button mat-button (click)="onCloseClick()">CLOSE</button>
    <button mat-button (click)="copyInputMessage(userinput)" value="click to copy" >
      COPY
    </button>
  </div>
  `
})
export class InviteDialog {
  constructor(
    public dialogRef: MatDialogRef<InviteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onCloseClick():void {
      this.dialogRef.close();
    }
    /* To copy Text from Textbox */
  copyInputMessage(inputElement){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

}
