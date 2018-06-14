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
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule } from '@angular/forms'
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import { CampaignComponent } from './campaign/campaign.component';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { EntityComponent } from './campaign/entity/entity.component';
import { EntityMiniComponent } from './campaign/entity-mini/entity-mini.component';
import { RelationshipComponent } from './campaign/relationship/relationship.component';

@NgModule({
  declarations: [
    AppComponent,
    AppNavbarComponent,
    CampaignComponent,
    CampaignListComponent,
    EntityComponent,
    EntityMiniComponent,
    RelationshipComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatIconModule, MatButtonModule, MatMenuModule, MatToolbarModule,MatListModule,
    MatCardModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule,
    MatAutocompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
