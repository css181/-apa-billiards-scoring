import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DashifyNamesPipe } from './pipes/dashify-names.pipe';
import { PlayFieldComponent } from './play-field/play-field.component';
import { TeamSelectionComponent } from './welcome/team-selection/team-selection.component';
import { PlayerInfoUpdateComponent } from './player-info-update/player-info-update.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'playField/:yourTeam/:opponentTeam', component: PlayFieldComponent },
  { path: 'teamSelection', component: TeamSelectionComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full'}
];

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpClientModule, RouterModule.forRoot(routes) ],
  declarations: [ AppComponent, WelcomeComponent, DashifyNamesPipe, PlayFieldComponent, TeamSelectionComponent, PlayerInfoUpdateComponent ],
  providers:    [ DashifyNamesPipe ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }