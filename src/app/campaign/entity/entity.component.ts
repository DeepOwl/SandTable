import { Component, OnInit, Input } from '@angular/core';
import { Entity } from '../../_models/entity'
import { RelationshipComponent } from '../relationship/relationship.component'
import { CampaignService }  from '../../_services/campaign.service'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent implements OnInit {
  @Input() entity:Entity;
  constructor(private router: Router,  private route: ActivatedRoute, private _campaign:CampaignService) { }

  ngOnInit() {
  }

  deleteEntity(entity){
    this._campaign.deleteEntity(this.entity.id);
    this.router.navigate(['../none'], {relativeTo: this.route});
  }

}
