import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DashifyNamesPipe } from './pipes/dashify-names.pipe';
import { PlayFieldComponent } from './play-field/play-field.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full'}
];

@NgModule({
  imports:      [ BrowserModule, HttpClientModule, RouterModule.forRoot(routes) ],
  declarations: [ AppComponent, WelcomeComponent, DashifyNamesPipe, PlayFieldComponent ],
  providers:    [ DashifyNamesPipe ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }