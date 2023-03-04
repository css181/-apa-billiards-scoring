import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICurrentPlayer } from '../interfaces/icurrentPlayer';
import { SharedDataService } from '../services/shared-data.service';

@Component({
  selector: 'abs-play-field',
  templateUrl: './play-field.component.html',
  styleUrls: ['./play-field.component.css']
})
export class PlayFieldComponent implements OnInit{
  @Input() yourTeam: string = '';
  @Input() opponentTeam: string = '';
  protected nextBall: number = 1;
  protected curBallImgPath: string = "assets/images/1ball.png";
  private lagLosingPlayer: ICurrentPlayer = {} as ICurrentPlayer;
  private lagWinningPlayer: ICurrentPlayer = {} as ICurrentPlayer;

  constructor(public sharedData: SharedDataService, private route: ActivatedRoute) { }

  ngOnInit() { 
    this.yourTeam = this.route.snapshot.paramMap.get('yourTeam') || '';
    this.opponentTeam = this.route.snapshot.paramMap.get('opponentTeam') || '';
    this.lagLosingPlayer = this.sharedData.getCurrentPlayerLagLoser();
    this.lagWinningPlayer = this.sharedData.getCurrentPlayerLagWinner();
  }

  updateNextBall(newNext: number) {
    this.nextBall = newNext;
    this.curBallImgPath = "assets/images/" + newNext + "ball.png";
  }

  public getNextBall(): number {
    return this.nextBall;
  }
  public getCurBallImgPath(): string {
    return this.curBallImgPath;
  }

  public getYourTeam(): string {
    return this.yourTeam || 'null';
  }
  public getOpponentTeam(): string {
    return this.opponentTeam || 'null';
  }

  public getLagWinningPlayer(): ICurrentPlayer {
    return this.lagWinningPlayer;
  }
  public getLagLosingPlayer(): ICurrentPlayer {
    return this.lagLosingPlayer;
  }
}
