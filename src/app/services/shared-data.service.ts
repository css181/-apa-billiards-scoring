import { Injectable } from '@angular/core';
import { ICurrentPlayer } from '../interfaces/icurrentPlayer';
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
}
