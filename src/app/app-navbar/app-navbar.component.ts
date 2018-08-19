import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../_services/campaign.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.css']
})
export class AppNavbarComponent implements OnInit {
  title:string  = "Thready"
  constructor(private _campaign:CampaignService) { }

  ngOnInit() {
  }

  toggleSidenav(){
    this._campaign.toggleSidenav();
  }

}
