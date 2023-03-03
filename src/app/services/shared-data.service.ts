import { Injectable } from '@angular/core';
import { IPlayer } from '../interfaces/iplayer';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private yourTeam:string = '';
  private opponentTeam: string = '';
  private yourTeamPlayers: IPlayer[] = [];
  private opponentTeamPlayers: IPlayer[] = [];
  
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

}
