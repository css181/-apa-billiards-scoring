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
  public isDeadBallMode: boolean = false;
  public sunkBallsList: number[] = [];

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

  updateNextBall(curBall: number) {
    let pointValue:number = 1;
    this.sunkBallsList.push(this.nextBall);
    if(curBall === 9) {
        pointValue=2;
        this.resetBallsToNewGame();
    }
    console.log(this.curShootingPlayer.name + ' hit next ball: ' + curBall);
    this.assignNewNextBall();
    this.curBallImgPath = "assets/images/" + this.nextBall + "ball.png";
    this.curShootingPlayer.curScore+=pointValue;
    console.log(this.curShootingPlayer.name + ' new score = ' + this.curShootingPlayer.curScore);
  }
  
  addDeadBall(ballNum: number) {
    if(this.sunkBallsList.indexOf(ballNum)==-1){
      this.deadBalls++;
      this.sunkBallsList.push(ballNum);
      if(this.nextBall===ballNum) {
        this.assignNewNextBall();
      }
    }
  }

  caremComboBall(ballNum: number) {
    if(this.sunkBallsList.indexOf(ballNum)==-1){
      this.sunkBallsList.push(ballNum);
      let pointValue:number = 1;
      if(ballNum == 9) {
          this.resetBallsToNewGame();
          pointValue=2;
      }
      if(this.nextBall===ballNum) {
        this.assignNewNextBall();
      }
      this.curShootingPlayer.curScore+=pointValue;
      console.log(this.curShootingPlayer.name + ' combo/caremed ' + ballNum);
      console.log(this.curShootingPlayer.name + ' new score = ' + this.curShootingPlayer.curScore);
    }
  }

  resetBallsToNewGame(): void {
    this.nextBall = 1;
    this.curBallImgPath = "assets/images/1ball.png";
    this.sunkBallsList = [];
  }

  assignNewNextBall(): void {
    let newNext = -1;
    for(let x=1; x<10; x++) {
      if(this.sunkBallsList.indexOf(x)===-1) {
        newNext = x;
        break;
      }
    }
    //Extra caution.
    if(newNext===-1) {
      console.error('We somehow could not figure out the next ball on a carem/combo or deadball... setting to 1');
      newNext = 1;
    }
    this.nextBall=newNext;
    this.curBallImgPath = "assets/images/" + this.nextBall + "ball.png";
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
    this.isDeadBallMode = false;
  }

  flipDeadBallMode(): void {
    this.isDeadBallMode = !this.isDeadBallMode;
  }

  onAddInning(): void {
    this.innings++;
  }
  onDecrementInning(): void {
    if(this.innings > 0)
      this.innings--;
  }
  onAddDeadBall(): void {
    this.deadBalls++;
  }
  onDecrementDeadBall(): void {
    if(this.deadBalls > 0)
      this.deadBalls--;
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
