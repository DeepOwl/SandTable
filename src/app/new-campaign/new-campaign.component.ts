import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import { CampaignService } from '../_services/campaign.service';
import { Campaign } from '../_models/campaign'
import { AuthService } from '../core/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-new-campaign',
  templateUrl: './new-campaign.component.html',
  styleUrls: ['./new-campaign.component.css']
})
export class NewCampaignComponent implements OnInit {
  campaignForm: FormGroup;
  user:any;
  constructor(private _campaign: CampaignService, private fb: FormBuilder, private router:Router, private auth:AuthService) {
    this.campaignForm = fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required]
    }) }

  ngOnInit() {
    this.auth.user.subscribe(
      (user) => {this.user = user}
    );
  }

  rebuildForm() {
    this.campaignForm.reset();
  }

  onFormSubmit(){
    const formModel = this.campaignForm.value;
    var roles = {}
    roles[this.user.uid] = 'owner';
    const campaign:Campaign = {
      name:formModel.name as string,
      created_at:new Date(),
      updated_at:new Date(),
      touched_at:new Date(),
      roles,
      invite:uuid(),
      description:formModel.description as string
    };

    var ret = this._campaign.addCampaign(campaign);
    ret.then(docRef => {
      this.router.navigate(['/campaigns']);
    });
    console.log(ret);
    this.rebuildForm();
  }

}
