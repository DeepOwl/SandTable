import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignComponent } from './campaign/campaign.component';
import { NewCampaignComponent } from './new-campaign/new-campaign.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  //{path: '', redirectTo: '/campaigns', pathMatch:'full'},
  {path: 'campaigns/new', component:NewCampaignComponent},
//  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
//  { path: 'dashboard', component: DashboardComponent },
//  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'campaign/:campaign', component: CampaignComponent },
  { path: 'campaign/:campaign/:entity', component: CampaignComponent },
  { path: 'campaigns', component: CampaignListComponent, canActivate:[AuthGuard] }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
