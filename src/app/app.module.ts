import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DashifyNamesPipe } from './pipes/dashify-names.pipe';
import { PlayFieldComponent } from './play-field/play-field.component';
import { TeamSelectionComponent } from './team-selection/team-selection.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'playField', component: PlayFieldComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full'}
];

@NgModule({
  imports:      [ BrowserModule, HttpClientModule, RouterModule.forRoot(routes) ],
  declarations: [ AppComponent, WelcomeComponent, DashifyNamesPipe, PlayFieldComponent, TeamSelectionComponent ],
  providers:    [ DashifyNamesPipe ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }