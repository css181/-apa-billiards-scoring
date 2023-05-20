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
  public getCurrentIndexIndex(): number {
    return this.log[this.getCurrentMatchIndex()].games[this.getCurrentGameIndex()].innings.length-1;
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
    //Add all the stuff in the most recent inning to the inning before, then remove the most recent inning

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
