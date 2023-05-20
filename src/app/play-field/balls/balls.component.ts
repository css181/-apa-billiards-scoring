import { Component } from '@angular/core';
import { ICurrentPlayer } from 'src/app/interfaces/icurrentPlayer';
import { IGame } from 'src/app/interfaces/igame';
import { IInning } from 'src/app/interfaces/iInnings';
import { ITurn } from 'src/app/interfaces/iTurn';
import { SharedDataService } from 'src/app/services/shared-data.service';
import DefenseGoneBadPlayers from '../../../assets/data/defense-gone-bad-players.json'
import HookerPlayers from '../../../assets/data/hookers-players.json';

@Component({
  selector: 'abs-balls',
  templateUrl: './balls.component.html',
  styleUrls: ['./balls.component.css']
})
export class BallsComponent {
  public curShootingPlayer: ICurrentPlayer = {} as ICurrentPlayer;
  public isDeadBallMode: boolean = false;
  public sunkBallsList: number[] = [];
  public nextBall: number = 1;
  public curBallImgPath: string = "assets/images/1ball.png";

  //TODO: these need to be retrieved/stored from what's in the Log in sharedData
  public innings: number = 0;
  public deadBalls: number = 0;
  
  
  //TODO: Remove later, setting defaults for easy manual testing purposes
  private yourPlayer = DefenseGoneBadPlayers[0];
  private opponentPlayer = HookerPlayers[0];
  private yourCurrentPlayer = {id: this.yourPlayer.id, name: this.yourPlayer.name, skill: this.yourPlayer.skill, team: 'Defense Gone Bad', curScore: 0} as ICurrentPlayer
  private opponentCurrentPlayer = {id: this.opponentPlayer.id, name: this.opponentPlayer.name, skill: this.opponentPlayer.skill, team: 'Hookers', curScore: 0} as ICurrentPlayer
  
  private lagLosingPlayer: ICurrentPlayer = this.opponentCurrentPlayer;//{} as ICurrentPlayer;
  private lagWinningPlayer: ICurrentPlayer = this.yourCurrentPlayer;//{} as ICurrentPlayer;

  constructor(public sharedData: SharedDataService) { }

  ngOnInit() { 
    //TODO: For easy testing purposes, set the shared data to our test info
    this.setupComponentForLocalTestingByDefaultingSharedData();
    
    this.lagLosingPlayer = this.sharedData.getCurrentPlayerLagLoser();
    this.lagWinningPlayer = this.sharedData.getCurrentPlayerLagWinner();
  }
  setupComponentForLocalTestingByDefaultingSharedData(): void {
    if(this.sharedData.getCurrentPlayerLagLoser().name===undefined) {
      this.sharedData.setCurrentPlayerLagLoser(this.opponentCurrentPlayer);
    }
    if(this.sharedData.getCurrentPlayerLagWinner().name===undefined) {
      this.sharedData.setCurrentPlayerLagWinner(this.yourCurrentPlayer);
    }
    if(this.sharedData.getLog().length===0) {
      this.sharedData.addMatchToLog(this.yourCurrentPlayer, this.opponentCurrentPlayer);
      this.sharedData.addGameToMatch({innings:[{lagWinnerTurn: {name: this.yourCurrentPlayer.name, ballsSunk:[], deadBalls:[]} as ITurn} as IInning]} as IGame, 0);
    }
  }

  private updateSharedDataLogForBallSunk(ballNum: number) {
    const matchIndex = this.sharedData.getCurrentMatchIndex();
    const gameIndex = this.sharedData.getCurrentGameIndex();
    const inningIndex = this.sharedData.getCurrentIndexIndex();
    if(this.curShootingPlayer===this.lagWinningPlayer) {
      this.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagWinnerTurn.ballsSunk.push(ballNum);
    } else {
      this.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagLoserTurn.ballsSunk.push(ballNum);
    }
  }

  addDeadBall(ballNum: number) {
    if(this.sunkBallsList.indexOf(ballNum)==-1){
      //TODO: Add deadball in a new way
      this.deadBalls++;
      this.sunkBallsList.push(ballNum);
      if(this.nextBall===ballNum) {
        this.assignNewNextBall();
      }
      this.updateSharedDataLogForDeadBall(ballNum);
    }
  }

  //TODO: combine some logic with updateSharedDataLogForBallSunk()
  private updateSharedDataLogForDeadBall(ballNum: number) {
    const matchIndex = this.sharedData.getCurrentMatchIndex();
    const gameIndex = this.sharedData.getCurrentGameIndex();
    const inningIndex = this.sharedData.getCurrentIndexIndex();
    if(this.curShootingPlayer===this.lagWinningPlayer) {
      this.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagWinnerTurn.deadBalls.push(ballNum);
    } else {
      this.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagLoserTurn.deadBalls.push(ballNum);
    }
  }

  updateNextBall(curBall: number) {
    this.sunkBallsList.push(curBall);
    this.assignNewNextBall();
    this.curShootingPlayer.curScore+=1;
    this.updateSharedDataLogForBallSunk(curBall);
    this.checkAndPerformPotentialEndGameUpdates(curBall);
    console.log(this.curShootingPlayer.name + ' hit next ball: ' + curBall);
    console.log(this.curShootingPlayer.name + ' new score = ' + this.curShootingPlayer.curScore);
  }
  caremComboBall(ballNum: number) {
    if(this.sunkBallsList.indexOf(ballNum)==-1){
      this.sunkBallsList.push(ballNum);
      if(this.nextBall===ballNum) {
        this.assignNewNextBall();
      }
      this.curShootingPlayer.curScore+=1;
      this.updateSharedDataLogForBallSunk(ballNum);
      this.checkAndPerformPotentialEndGameUpdates(ballNum);
      console.log(this.curShootingPlayer.name + ' combo/caremed ' + ballNum);
      console.log(this.curShootingPlayer.name + ' new score = ' + this.curShootingPlayer.curScore);
    }
  }

  checkAndPerformPotentialEndGameUpdates(sunkBall: number) {
    if(sunkBall == 9) {
      this.curShootingPlayer.curScore+=1;
      this.resetBallsToNewGame();
      this.resetNewGameInLog();
    }
  }

  resetBallsToNewGame(): void {
    this.nextBall = 1;
    this.curBallImgPath = "assets/images/1ball.png";
    this.sunkBallsList = [];
  }
  
  resetNewGameInLog(): void {
    this.sharedData.addGameToMatch({innings: []} as IGame, this.sharedData.getLog().length-1);
    if(this.curShootingPlayer === this.lagWinningPlayer) {
      this.sharedData.addInningToLog({lagWinnerTurn: {name: this.lagWinningPlayer.name, ballsSunk: [], deadBalls: []} as ITurn } as IInning);
    } else {
      this.sharedData.addInningToLog({lagLoserTurn: {name: this.lagLosingPlayer.name, ballsSunk: [], deadBalls: []} as ITurn } as IInning);
    }
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
    let inning: IInning = this.sharedData.getLog()[this.sharedData.getCurrentMatchIndex()].games[this.sharedData.getCurrentGameIndex()].innings[this.sharedData.getCurrentIndexIndex()];
    if(this.curShootingPlayer === this.lagWinningPlayer) {
      this.curShootingPlayer = this.lagLosingPlayer;
      inning.lagLoserTurn = {name: this.lagLosingPlayer.name, ballsSunk: [], deadBalls: []} as ITurn;
    } else {
      this.curShootingPlayer = this.lagWinningPlayer;
      //TODO: Add an inning in a new way
      this.innings++;
      console.log('adding inning');
      this.sharedData.addInningToLog({ lagWinnerTurn: {name: this.lagWinningPlayer.name, ballsSunk: [], deadBalls: []} as ITurn } as IInning)
    }
    this.isDeadBallMode = false;
  }

  flipDeadBallMode(): void {
    this.isDeadBallMode = !this.isDeadBallMode;
  }

  
  public getNextBall(): number {
    return this.nextBall;
  }
  public getCurBallImgPath(): string {
    return this.curBallImgPath;
  }


  public getLagWinningPlayer(): ICurrentPlayer {
    return this.lagWinningPlayer;
  }
  public getLagLosingPlayer(): ICurrentPlayer {
    return this.lagLosingPlayer;
  }
}
