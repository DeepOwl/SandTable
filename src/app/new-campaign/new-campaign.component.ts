import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import { CampaignService } from '../_services/campaign.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-campaign',
  templateUrl: './new-campaign.component.html',
  styleUrls: ['./new-campaign.component.css']
})
export class NewCampaignComponent implements OnInit {
  campaignForm: FormGroup;
  constructor(private _campaign: CampaignService, private fb: FormBuilder, private router:Router) {
    this.campaignForm = fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required]
    }) }

  ngOnInit() {
  }

  rebuildForm() {
    this.campaignForm.reset();
  }

  onFormSubmit(){
    const formModel = this.campaignForm.value;
    const campaign:any = {
      name:formModel.name as string,
      created_at:new Date(),
      updated_at:new Date(),
      touched_at:new Date(),
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
