import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from './../environments/environment';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav'
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule } from '@angular/forms'
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog'
import { FlexLayoutModule } from "@angular/flex-layout";

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import { CampaignComponent } from './campaign/campaign.component';
import { CampaignListComponent, InviteDialog } from './campaign-list/campaign-list.component';
import { EntityComponent, CreateRelationshipDialog } from './campaign/entity/entity.component';
import { EntityMiniComponent } from './campaign/entity-mini/entity-mini.component';
import { RelationshipComponent, EditRelationshipDialog } from './campaign/relationship/relationship.component';
import { NewCampaignComponent } from './new-campaign/new-campaign.component';
import { LoginComponent } from './login/login.component';

import { CoreModule } from './core/core.module';
import { CampaignListItemComponent } from './campaign-list/campaign-list-item/campaign-list-item.component';

@NgModule({
  declarations: [
    AppComponent,
    AppNavbarComponent,
    CampaignComponent,
    CampaignListComponent,
    EntityComponent, CreateRelationshipDialog,
    EntityMiniComponent,
    RelationshipComponent,EditRelationshipDialog,
    NewCampaignComponent,
    LoginComponent,
    CampaignListItemComponent, InviteDialog
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    FlexLayoutModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    CoreModule,
    MatIconModule, MatButtonModule, MatMenuModule, MatToolbarModule,MatListModule,
    MatCardModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule,
    MatAutocompleteModule, MatSidenavModule, MatSelectModule, MatChipsModule, MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents:[EditRelationshipDialog, InviteDialog, CreateRelationshipDialog]
})
export class AppModule { }
