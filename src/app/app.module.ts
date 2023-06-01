import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DashifyNamesPipe } from './pipes/dashify-names.pipe';
import { PlayFieldComponent } from './play-field/play-field.component';
import { TeamSelectionComponent } from './welcome/team-selection/team-selection.component';
import { PlayerInfoUpdateComponent } from './welcome/player-info-update/player-info-update.component';
import { FormsModule } from '@angular/forms';
import { PutUpComponent } from './put-up/put-up.component';
import { CurrentPlayerScoreComponent } from './play-field/current-player-score/current-player-score.component';
import { BallsComponent } from './play-field/balls/balls.component';
import { MatchLogComponent } from './play-field/match-log/match-log.component';
import { GameConfirmComponent } from './play-field/game-confirm/game-confirm.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'playField/:yourTeam/:opponentTeam', component: PlayFieldComponent },
  { path: 'putUp', component: PutUpComponent },
  { path: 'teamSelection', component: TeamSelectionComponent },
  { path: 'currentPlayerScore/:isLagWinner', component: CurrentPlayerScoreComponent },
  { path: 'matchLog/:matchIndex', component: MatchLogComponent },
  { path: 'balls', component: BallsComponent },
  { path: 'gameConfirm/:isLagWinnerShooting', component: GameConfirmComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full'}
];

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpClientModule, RouterModule.forRoot(routes) ],
  declarations: [ AppComponent, WelcomeComponent, DashifyNamesPipe, PlayFieldComponent, TeamSelectionComponent, PlayerInfoUpdateComponent, PutUpComponent, CurrentPlayerScoreComponent, BallsComponent, MatchLogComponent, GameConfirmComponent ],
  providers:    [ DashifyNamesPipe ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }