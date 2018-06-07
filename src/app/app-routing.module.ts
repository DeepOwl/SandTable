import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignComponent } from './campaign/campaign.component';

const routes: Routes = [
  {path: '', redirectTo: '/campaigns', pathMatch:'full'},
//  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
//  { path: 'dashboard', component: DashboardComponent },
//  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'campaign/:campaign', component: CampaignComponent },
  { path: 'campaign/:campaign/:entity', component: CampaignComponent },
  { path: 'campaigns', component: CampaignListComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
