import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../_services/campaign.service';
import { Observable } from 'rxjs/Observable';

export interface Campaign { name:string; description:string; owner:string; }
export interface CampaignId extends Campaign { id: string; }

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.css']
})
export class CampaignListComponent implements OnInit {
  public campaigns: Observable<any[]>;

  constructor(_campaign:CampaignService) {
    this.campaigns = _campaign.getCampaignList()
    //this.campaigns = db.collection('/campaigns').valueChanges();

  }

  ngOnInit() {
  }

}
