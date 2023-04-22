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

  getYourTeam(): any {
    return this.yourTeam;
  }
  setYourTeam(teamName: string) {
    this.yourTeam = teamName;
  }
  getOpponentTeam(): any {
    return this.opponentTeam;
  }
  setOpponentTeam(teamName: string) {
    this.opponentTeam = teamName;
  }

  getLog(): IMatch[] {
    return this.log;
  }
  getCurrentMatchIndex(): number {
    return this.log.length-1;
  }
  getCurrentGameIndex(): number {
    return this.log[this.getCurrentMatchIndex()].games.length-1;
  }
  getCurrentIndexIndex(): number {
    return this.log[this.getCurrentMatchIndex()].games[this.getCurrentGameIndex()].innings.length-1;
  }
  addMatchToLog(lagWinner: IPlayer, lagLoser: IPlayer) {
    this.log.push({games: [], lagLoser: lagLoser, lagWinner: lagWinner} as IMatch);
  }
  addGameToMatch(game: IGame, matchIndex: number) {
    if(this.log[matchIndex]) {
      this.log[matchIndex].games.push(game);
    } else {
      console.error("Log does not have a Match Index:" + matchIndex + ", so could not add Game:" + JSON.stringify(game));
    }
  }
  addInningToLog(inning: IInning) {
    const matchIndex = this.log.length-1;
    const gameIndex = this.log[matchIndex].games.length-1;
    if(this.log[matchIndex].games[gameIndex].innings) {
      this.log[matchIndex].games[gameIndex].innings.push(inning);
    } else {
      console.error("Log does not have a Match Index:" + matchIndex + ", or a Game Index: " + gameIndex + ", so could not add Inning:" + JSON.stringify(inning));
    }
  }

  getYourTeamPlayers(): any {
    return this.yourTeamPlayers;
  }
  setYourTeamPlayers(players: IPlayer[]) {
    this.yourTeamPlayers = players;
  }
  getOpponentTeamPlayers(): any {
    return this.opponentTeamPlayers;
  }
  setOpponentTeamPlayers(players: IPlayer[]) {
    this.opponentTeamPlayers = players;
  }

  getCurrentPlayerLagWinner(): ICurrentPlayer {
    return this.currentPlayerLagWinner;
  }
  setCurrentPlayerLagWinner(curPlayer: ICurrentPlayer) {
    this.currentPlayerLagWinner = curPlayer;
  }
  getCurrentPlayerLagLoser(): ICurrentPlayer {
    return this.currentPlayerLagLoser;
  }
  setCurrentPlayerLagLoser(curPlayer: ICurrentPlayer) {
    this.currentPlayerLagLoser = curPlayer;
  }

  getTargetScore(skill: number): number {
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
