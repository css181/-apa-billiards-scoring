import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
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
  @Output() newGameEventEmitter: EventEmitter<string> = new EventEmitter<string>();

  //TODO: Remove later, setting defaults for easy manual testing purposes
  private yourPlayer = DefenseGoneBadPlayers[0];
  private opponentPlayer = HookerPlayers[0];
  private yourCurrentPlayer = {id: this.yourPlayer.id, name: this.yourPlayer.name, skill: this.yourPlayer.skill, team: 'Defense Gone Bad', curScore: 0} as ICurrentPlayer
  private opponentCurrentPlayer = {id: this.opponentPlayer.id, name: this.opponentPlayer.name, skill: this.opponentPlayer.skill, team: 'Hookers', curScore: 0} as ICurrentPlayer
  
  //Should really be set to empty, but setting defaults for easy manual testing
  private lagLosingPlayer: ICurrentPlayer = this.opponentCurrentPlayer;//{} as ICurrentPlayer;
  private lagWinningPlayer: ICurrentPlayer = this.yourCurrentPlayer;//{} as ICurrentPlayer;

  constructor(public sharedData: SharedDataService, public router: Router) { }

  ngOnInit() { 
    //TODO: For easy testing purposes, set the shared data to our test info
    this.setupComponentForLocalTestingByDefaultingSharedData();
    
    this.lagLosingPlayer = this.sharedData.getCurrentPlayerLagLoser();
    this.lagWinningPlayer = this.sharedData.getCurrentPlayerLagWinner();
    this.curShootingPlayer = this.getCurShootingPlayerFromLog();
    this.sunkBallsList = this.getAllSunkBallsFromGameLog();
    this.assignNewNextBall();
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
      this.sharedData.addGameToMatch({innings:[{lagWinnerTurn: {name: this.yourCurrentPlayer.name, ballsSunk:[], deadBalls:[], timeouts: 0} as ITurn} as IInning]} as IGame, 0);
    }
  }
  getAllSunkBallsFromGameLog(): number[] {
    let returnList: number[] = [];
    let inningList: IInning[] = this.sharedData.getCurrentGame().innings;
    for (let index = 0; index < inningList.length; index++) {
      const inning = inningList[index];
      returnList = returnList.concat(addAllLagWinnerSunkBalls(inning));
      returnList = returnList.concat(addAllLagWinnerDeadBalls(inning));
      returnList = returnList.concat(addAllLagLoserSunkBalls(inning));
      returnList = returnList.concat(addAllLagLoserDeadBalls(inning));
    }
    return returnList;

    function addAllLagWinnerSunkBalls(inning: IInning): number[] {
      let returnList = [];
      if(inning.lagWinnerTurn) {
        for (let index = 0; index < inning.lagWinnerTurn.ballsSunk.length; index++) {
          const ball = inning.lagWinnerTurn.ballsSunk[index];
          returnList.push(ball);
        }
      }
      return returnList;
    }
    function addAllLagWinnerDeadBalls(inning: IInning): number[] {
      let returnList = [];
      if(inning.lagWinnerTurn) {
        for (let index = 0; index < inning.lagWinnerTurn.deadBalls.length; index++) {
          const ball = inning.lagWinnerTurn.deadBalls[index];
          returnList.push(ball);
        }
      }
      return returnList;
    }
    function addAllLagLoserSunkBalls(inning: IInning): number[] {
      let returnList = [];
      if(inning.lagLoserTurn) {
        for (let index = 0; index < inning.lagLoserTurn.ballsSunk.length; index++) {
          const ball = inning.lagLoserTurn.ballsSunk[index];
          returnList.push(ball);
        }
      }
      return returnList;
    }
    function addAllLagLoserDeadBalls(inning: IInning): number[] {
      let returnList = [];
      if(inning.lagLoserTurn) {
        for (let index = 0; index < inning.lagLoserTurn.deadBalls.length; index++) {
          const ball = inning.lagLoserTurn.deadBalls[index];
          returnList.push(ball);
        }
      }
      return returnList;
    }
  }
  getCurShootingPlayerFromLog(): ICurrentPlayer {
    if(this.sharedData.getCurrentGame().innings[this.sharedData.getCurrentInningIndex()].lagLoserTurn) {
      return this.lagLosingPlayer;
    } else {
      return this.lagWinningPlayer;
    }
  }

  private updateSharedDataLogForBallSunk(ballNum: number) {
    const matchIndex = this.sharedData.getCurrentMatchIndex();
    const gameIndex = this.sharedData.getCurrentGameIndex();
    const inningIndex = this.sharedData.getCurrentInningIndex();
    if(this.curShootingPlayer===this.lagWinningPlayer) {
      this.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagWinnerTurn.ballsSunk.push(ballNum);
    } else {
      this.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagLoserTurn.ballsSunk.push(ballNum);
    }
  }

  addDeadBall(ballNum: number) {
    if(this.sunkBallsList.indexOf(ballNum)===-1){
      this.sharedData.addDeadBall(ballNum);
      this.sunkBallsList.push(ballNum);
      if(this.nextBall===ballNum) {
        this.assignNewNextBall();
      }
    }
  }

  updateNextBall(curBall: number) {
    this.sunkBallsList.push(curBall);
    this.assignNewNextBall();
    this.curShootingPlayer.curScore+=1;
    this.updateSharedDataLogForBallSunk(curBall);
    this.checkAndPerformPotentialEndGameUpdates(curBall);
    // console.log(this.curShootingPlayer.name + ' hit next ball: ' + curBall);
    // console.log(this.curShootingPlayer.name + ' new score = ' + this.curShootingPlayer.curScore);
  }
  caremComboBall(ballNum: number) {
    if(this.sunkBallsList.indexOf(ballNum)===-1){
      this.sunkBallsList.push(ballNum);
      if(ballNum===9) {
        this.addAnyUnsunkBallsToDeadBalls();
      }
      if(this.nextBall===ballNum) {
        this.assignNewNextBall();
      }
      this.curShootingPlayer.curScore+=1;
      this.updateSharedDataLogForBallSunk(ballNum);
      this.checkAndPerformPotentialEndGameUpdates(ballNum);
      // console.log(this.curShootingPlayer.name + ' combo/caremed ' + ballNum);
      // console.log(this.curShootingPlayer.name + ' new score = ' + this.curShootingPlayer.curScore);
    }
  }

  addAnyUnsunkBallsToDeadBalls() {
    for (let ballTryNum = 1; ballTryNum <= 8; ballTryNum++){
      if(this.sunkBallsList.indexOf(ballTryNum)===-1) {
        this.addDeadBall(ballTryNum);
      }
    }
  }

  checkAndPerformPotentialEndGameUpdates(sunkBall: number) {
    if(sunkBall == 9) {
      this.curShootingPlayer.curScore+=1;
      this.resetBallsToNewGame();
      this.newGameEventEmitter.emit();
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
    // console.log(this.curShootingPlayer.name + ' ended their turn.');
    let inning: IInning = this.sharedData.getLog()[this.sharedData.getCurrentMatchIndex()].games[this.sharedData.getCurrentGameIndex()].innings[this.sharedData.getCurrentInningIndex()];
    if(this.curShootingPlayer === this.lagWinningPlayer) {
      this.curShootingPlayer = this.lagLosingPlayer;
      inning.lagLoserTurn = {name: this.lagLosingPlayer.name, ballsSunk: [], deadBalls: [], timeouts: 0} as ITurn;
    } else {
      this.curShootingPlayer = this.lagWinningPlayer;
      // console.log('adding inning');
      this.sharedData.addInningToLog({ lagWinnerTurn: {name: this.lagWinningPlayer.name, ballsSunk: [], deadBalls: [], timeouts: 0} as ITurn } as IInning)
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
