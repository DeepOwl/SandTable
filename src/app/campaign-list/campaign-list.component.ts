import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../_services/campaign.service';
import { Observable } from 'rxjs/Observable';
import { Campaign } from '../_models/campaign'


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

  constructor(private _campaign:CampaignService) {
    this.campaigns = _campaign.getCampaignList()
    this.campaignsGuest = _campaign.getCampaignListGuest()
    //this.campaigns = db.collection('/campaigns').valueChanges();

  }

  ngOnInit() {
  }

  showInviteCode(){
    this.showInvite = true;
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
