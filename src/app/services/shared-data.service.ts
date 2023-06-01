import { Injectable } from '@angular/core';
import { ICurrentPlayer } from '../interfaces/icurrentPlayer';
import { IGame } from '../interfaces/igame';
import { IInning } from '../interfaces/iInnings';
import { IMatch } from '../interfaces/iMatch';
import { IPlayer } from '../interfaces/iplayer';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private yourTeam:string = '';
  private opponentTeam: string = '';
  private yourTeamPlayers: IPlayer[] = [];
  private opponentTeamPlayers: IPlayer[] = [];
  private currentPlayerLagWinner: ICurrentPlayer = {} as ICurrentPlayer;
  private currentPlayerLagLoser: ICurrentPlayer = {} as ICurrentPlayer;
  private log: IMatch[] = [];
  public totalDeadBallCount: number = 0;
  public gameDeadBallCount: number = 0;
  public lagWinnerDefences: number = 0;
  public lagLoserDefences: number = 0;

  constructor() { }

  public getYourTeam(): any {
    return this.yourTeam;
  }
  public setYourTeam(teamName: string) {
    this.yourTeam = teamName;
  }
  public getOpponentTeam(): any {
    return this.opponentTeam;
  }
  public setOpponentTeam(teamName: string) {
    this.opponentTeam = teamName;
  }

  public getLog(): IMatch[] {
    return this.log;
  }
  setLog(log: IMatch[]) {
    this.log = log;
  }
  public getCurrentMatchIndex(): number {
    return this.log.length-1;
  }
  public getCurrentGameIndex(): number {
    return this.log[this.getCurrentMatchIndex()].games.length-1;
  }
  public getCurrentGame(): IGame {
    return this.log[this.getCurrentMatchIndex()].games[this.getCurrentGameIndex()];
  }
  public getCurrentInningIndex(): number {
    return this.log[this.getCurrentMatchIndex()].games[this.getCurrentGameIndex()].innings.length-1;
  }
  public getTotalInningCount(): number {
    let answer = 0;
    const curMatch = this.log[this.getCurrentMatchIndex()];
    for (let index = 0; index < curMatch.games.length; index++) {
      const game = curMatch.games[index];
      answer += game.innings.length-1;
    }
    return answer;
  }
  public getGameDeadBallCount(): number {
    return this.gameDeadBallCount;
  }
  public resetDeadBallCountForNewGame(): void {
    this.gameDeadBallCount = 0;
  }
  public getTotalDeadBallCount(): number {
    return this.totalDeadBallCount;
  }
  public addMatchToLog(lagWinner: IPlayer, lagLoser: IPlayer) {
    this.log.push({games: [], lagLoser: lagLoser, lagWinner: lagWinner} as IMatch);
  }
  public addGameToMatch(game: IGame, matchIndex: number) {
    if(this.log[matchIndex]) {
      this.log[matchIndex].games.push(game);
    } else {
      console.error("Log does not have a Match Index:" + matchIndex + ", so could not add Game:" + JSON.stringify(game));
    }
  }
  public addInningToLog(inning: IInning) {
    const matchIndex = this.log.length-1;
    const gameIndex = this.log[matchIndex].games.length-1;
    if(this.log[matchIndex].games[gameIndex].innings) {
      this.log[matchIndex].games[gameIndex].innings.push(inning);
    } else {
      console.error("Log does not have a Match Index:" + matchIndex + ", or a Game Index: " + gameIndex + ", so could not add Inning:" + JSON.stringify(inning));
    }
  }
  public decrementInning() {
    //First try to remove any blank innings that have no balls sunk or deadballs from size to 0.
    //If there are no blank innings, then
    //Add all the stuff in the most recent inning to the inning before, then remove the most recent inning
    const matchIndex = this.log.length-1;
    const gameIndex = this.log[matchIndex].games.length-1;
    const lastInningIndex = this.log[matchIndex].games[gameIndex].innings.length - 1;
    if(lastInningIndex<1) {
      return;//Can't remove unless there are at least 2 innings.
    }
    for (let inningIndex = lastInningIndex; inningIndex >= 0; inningIndex--) {
      const inning = this.log[matchIndex].games[gameIndex].innings[inningIndex];
      if(isBlankInning(inning)) {
        this.deleteArrayElement(this.log[matchIndex].games[gameIndex].innings, this.log[matchIndex].games[gameIndex].innings[inningIndex]);
        return; //Only remove 1 inning
      }
    }
    const latestInning = this.log[matchIndex].games[gameIndex].innings[lastInningIndex];
    const priorInning = this.log[matchIndex].games[gameIndex].innings[lastInningIndex-1];
    mergeLagWinnerBallsSunk();
    mergeLagWinnerDeadballs();
    mergeLagWinnerTimeouts();
    mergeLagLoserBallsSunk();
    mergeLagLoserDeadballs();
    mergeLagLoserTimeouts();
    this.deleteArrayElement(this.log[matchIndex].games[gameIndex].innings, this.log[matchIndex].games[gameIndex].innings[lastInningIndex]);

    function isBlankInning(inning: IInning): boolean {
      return inning.lagLoserTurn && inning.lagLoserTurn.ballsSunk.length==0 && inning.lagLoserTurn.deadBalls.length==0
        && inning.lagWinnerTurn.ballsSunk.length==0 && inning.lagWinnerTurn.deadBalls.length==0;
    }
    function mergeLagWinnerBallsSunk(): void {
      for (let i = 0; i < latestInning.lagWinnerTurn.ballsSunk.length; i++) {
        const curWinnerBallSunk = latestInning.lagWinnerTurn.ballsSunk[i];
        priorInning.lagWinnerTurn.ballsSunk.push(curWinnerBallSunk);
      }
    }
    function mergeLagWinnerDeadballs(): void {
      for (let i = 0; i < latestInning.lagWinnerTurn.deadBalls.length; i++) {
        const curWinnerDeadBalls = latestInning.lagWinnerTurn.deadBalls[i];
        priorInning.lagWinnerTurn.deadBalls.push(curWinnerDeadBalls);
      }
    }
    function mergeLagLoserBallsSunk(): void {
      for (let i = 0; i < latestInning.lagLoserTurn.ballsSunk.length; i++) {
        const curLoserBallSunk = latestInning.lagLoserTurn.ballsSunk[i];
        priorInning.lagLoserTurn.ballsSunk.push(curLoserBallSunk);
      }
    }
    function mergeLagLoserDeadballs(): void {
      for (let i = 0; i < latestInning.lagLoserTurn.deadBalls.length; i++) {
        const curLoserDeadBalls = latestInning.lagLoserTurn.deadBalls[i];
        priorInning.lagLoserTurn.deadBalls.push(curLoserDeadBalls);
      }
    }
    function mergeLagWinnerTimeouts(): void {
      priorInning.lagWinnerTurn.timeouts+= latestInning.lagWinnerTurn.timeouts;
    }
    function mergeLagLoserTimeouts(): void {
      priorInning.lagLoserTurn.timeouts+= latestInning.lagLoserTurn.timeouts;
    }
  }

  public addDeadBall(ballNum: number): void {
    const matchIndex = this.log.length-1;
    const gameIndex = this.log[matchIndex].games.length-1;
    const lastInningIndex = this.log[matchIndex].games[gameIndex].innings.length - 1;

    if(this.log[matchIndex].games[gameIndex].innings[lastInningIndex].lagLoserTurn) {
      this.log[matchIndex].games[gameIndex].innings[lastInningIndex].lagLoserTurn.deadBalls.push(ballNum);
    } else {
      this.log[matchIndex].games[gameIndex].innings[lastInningIndex].lagWinnerTurn.deadBalls.push(ballNum);
    }
    this.incrementDeadBall();
  }
  public incrementDeadBall(): void {
    this.totalDeadBallCount++;
    this.gameDeadBallCount++;
  }
  public decrementDeadBall(): void {
    if(this.gameDeadBallCount>0) {
      this.totalDeadBallCount--;
      this.gameDeadBallCount--;
    }
  }

  public deleteArrayElement(list: any[], element: any): any[] {
    const index = list.indexOf(element, 0);
    if (index > -1) {
      list.splice(index, 1);
    }
    return list;
  }
  public getYourTeamPlayers(): any {
    return this.yourTeamPlayers;
  }
  public setYourTeamPlayers(players: IPlayer[]) {
    this.yourTeamPlayers = players;
  }
  public getOpponentTeamPlayers(): any {
    return this.opponentTeamPlayers;
  }
  public setOpponentTeamPlayers(players: IPlayer[]) {
    this.opponentTeamPlayers = players;
  }

  public getCurrentPlayerLagWinner(): ICurrentPlayer {
    return this.currentPlayerLagWinner;
  }
  public setCurrentPlayerLagWinner(curPlayer: ICurrentPlayer) {
    this.currentPlayerLagWinner = curPlayer;
  }
  public getCurrentPlayerLagLoser(): ICurrentPlayer {
    return this.currentPlayerLagLoser;
  }
  public setCurrentPlayerLagLoser(curPlayer: ICurrentPlayer) {
    this.currentPlayerLagLoser = curPlayer;
  }

  public increaseLagWinnerDefences() {
    this.lagWinnerDefences++;
  }
  public decreaseLagWinnerDefences() {
    this.lagWinnerDefences--;
  }
  public getLagWinnerDefences(): number {
    return this.lagWinnerDefences;
  }
  public increaseLagLoserDefences() {
    this.lagLoserDefences++;
  }
  public decreaseLagLoserDefences() {
    this.lagLoserDefences--;
  }
  public getLagLoserDefences(): number {
    return this.lagLoserDefences;
  }

  public getTargetScore(skill: number): number {
    let target:number = 0;
    switch (skill) {
      case 1:
        target=14; break;
      case 2:
        target=19; break;
      case 3:
        target=25; break;
      case 4:
        target=31; break;
      case 5:
        target=38; break;
      case 6:
        target=46; break;
      case 7:
        target=55; break;
      case 8:
        target=65; break;
      case 9:
        target=75; break;
      default:
        break;
    }
    return target;
  }
}
