import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICurrentPlayer } from '../interfaces/icurrentPlayer';
import { SharedDataService } from '../services/shared-data.service';
import DefenseGoneBadPlayers from '../../assets/data/defense-gone-bad-players.json'
import HookerPlayers from '../../assets/data/hookers-players.json';

@Component({
  selector: 'abs-play-field',
  templateUrl: './play-field.component.html',
  styleUrls: ['./play-field.component.css']
})
export class PlayFieldComponent implements OnInit{
  @Input() yourTeam: string = '';
  @Input() opponentTeam: string = '';
  public nextBall: number = 1;
  public curBallImgPath: string = "assets/images/1ball.png";

  //TODO: Remove later, setting defaults for easy manual testing purposes
  private yourPlayer = DefenseGoneBadPlayers[0];
  private opponentPlayer = HookerPlayers[0];
  private yourCurrentPlayer = {id: this.yourPlayer.id, name: this.yourPlayer.name, skill: this.yourPlayer.skill, team: 'Defense Gone Bad', curScore: 0} as ICurrentPlayer
  private opponentCurrentPlayer = {id: this.opponentPlayer.id, name: this.opponentPlayer.name, skill: this.opponentPlayer.skill, team: 'Hookers', curScore: 0} as ICurrentPlayer
  
  private lagLosingPlayer: ICurrentPlayer = this.opponentCurrentPlayer;//{} as ICurrentPlayer;
  private lagWinningPlayer: ICurrentPlayer = this.yourCurrentPlayer;//{} as ICurrentPlayer;

  public curShootingPlayer: ICurrentPlayer = {} as ICurrentPlayer;
  public innings: number = 0;
  public deadBalls: number = 0;

  constructor(public sharedData: SharedDataService, private route: ActivatedRoute) { }

  ngOnInit() { 
    this.yourTeam = this.route.snapshot.paramMap.get('yourTeam') || '';
    this.opponentTeam = this.route.snapshot.paramMap.get('opponentTeam') || '';
    if(this.sharedData.getCurrentPlayerLagLoser().name===undefined) {
      //TODO: For easy testing purposes, set the shared data to our test info
      this.sharedData.setCurrentPlayerLagLoser(this.opponentCurrentPlayer);
    }
    this.lagLosingPlayer = this.sharedData.getCurrentPlayerLagLoser();
    if(this.sharedData.getCurrentPlayerLagWinner().name===undefined) {
            //TODO: For easy testing purposes, set the shared data to our test info
            this.sharedData.setCurrentPlayerLagWinner(this.yourCurrentPlayer);
    }
    this.lagWinningPlayer = this.sharedData.getCurrentPlayerLagWinner();
    this.curShootingPlayer = this.lagWinningPlayer;
  }

  updateNextBall(newNext: number) {
    let pointValue:number = 1;
    if(newNext > 9) {
      newNext = 1;
      pointValue=2;
    }
    console.log(this.curShootingPlayer.name + ' hit ' + this.nextBall);
    this.nextBall = newNext;
    this.curBallImgPath = "assets/images/" + newNext + "ball.png";
    this.curShootingPlayer.curScore+=pointValue;
    console.log(this.curShootingPlayer.name + ' new score = ' + this.curShootingPlayer.curScore);
  }

  onEndTurn(): void {
    console.log(this.curShootingPlayer.name + ' ended their turn.');
    if(this.curShootingPlayer === this.lagWinningPlayer) {
      this.curShootingPlayer = this.lagLosingPlayer;
    } else {
      this.curShootingPlayer = this.lagWinningPlayer;
      this.innings++;
      console.log('adding inning');
    }
  }

  onAddInning(): void {
    this.innings++;
  }
  onDecrementInning(): void {
    if(this.innings > 0)
      this.innings--;
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
