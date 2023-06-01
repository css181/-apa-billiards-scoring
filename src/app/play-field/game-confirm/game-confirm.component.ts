import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IGame } from 'src/app/interfaces/igame';
import { IInning } from 'src/app/interfaces/iInnings';
import { ITurn } from 'src/app/interfaces/iTurn';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'abs-game-confirm',
  templateUrl: './game-confirm.component.html',
  styleUrls: ['./game-confirm.component.css']
})
export class GameConfirmComponent {
  @Input() isLagWinnerShooting: boolean = true;
  public lagWinnerName: string;
  public lagWinnerScore: number;
  public inningCount: number;
  public totalDeadballs: number;
  public gameDeadballs: number;
  public lagLoserName: string;
  public lagLoserScore: number;
  @Output() confirmScoresCorrectEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(public sharedData: SharedDataService, public router: Router) {
    this.lagWinnerName = sharedData.getCurrentPlayerLagWinner().name;
    this.lagWinnerScore = sharedData.getCurrentPlayerLagWinner().curScore;
    this.inningCount = sharedData.getCurrentInningIndex();
    this.totalDeadballs = sharedData.getTotalDeadBallCount();
    this.gameDeadballs = sharedData.getGameDeadBallCount();
    this.lagLoserName = sharedData.getCurrentPlayerLagLoser().name;
    this.lagLoserScore = sharedData.getCurrentPlayerLagLoser().curScore;
  }

  onConfirmClick(): void {
    this.resetNewGameInLog();
    this.confirmScoresCorrectEmitter.emit();
  }
  resetNewGameInLog(): void {
    this.sharedData.resetDeadBallCountForNewGame();
    this.sharedData.addGameToMatch({innings: []} as IGame, this.sharedData.getLog().length-1);
    if(this.isLagWinnerShooting) {
      this.sharedData.addInningToLog({lagWinnerTurn: {name: this.lagWinnerName, ballsSunk: [], deadBalls: [], timeouts: 0} as ITurn } as IInning);
    } else {
      this.sharedData.addInningToLog({lagLoserTurn: {name: this.lagLoserName, ballsSunk: [], deadBalls: [], timeouts: 0} as ITurn } as IInning);
    }
  }
}
