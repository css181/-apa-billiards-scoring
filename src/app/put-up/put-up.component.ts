import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPlayer } from '../interfaces/iplayer';
import { SharedDataService } from '../services/shared-data.service';

export const blankPlayer:IPlayer = {id:'', name:'', skill:0} as IPlayer
@Component({
  selector: 'abs-put-up',
  templateUrl: './put-up.component.html',
  styleUrls: ['./put-up.component.css']
})
export class PutUpComponent {
  private yourTeam: string = '';
  private opponentTeam: string = '';
  private yourPlayers: IPlayer[] = [];
  private opponentPlayers: IPlayer[] = [];
  private yourTeamSelectedPlayer: IPlayer = blankPlayer;
  private opponentTeamSelectedPlayer: IPlayer = blankPlayer;
  
  constructor(public sharedData: SharedDataService) { }

  ngOnInit() { 
    this.yourTeam = this.sharedData.getYourTeam();
    this.opponentTeam = this.sharedData.getOpponentTeam();
    this.yourPlayers = this.sharedData.getYourTeamPlayers();
    this.opponentPlayers = this.sharedData.getOpponentTeamPlayers();
  }

  onChooseYourPlayer(player: IPlayer): void {
    console.log('Putting up Your player: ', player);
    this.yourTeamSelectedPlayer = player;
  }
  onChooseOpponentPlayer(player: IPlayer): void {
    console.log('Putting up Opponent player: ', player);
    this.opponentTeamSelectedPlayer = player;
  }

  public getYourTeam(): string {
    return this.yourTeam || 'null';
  }
  public getYourPlayers(): IPlayer[] {
    return this.yourPlayers;
  }
  public getOpponentTeam(): string {
    return this.opponentTeam || 'null';
  }
  public getOpponentPlayers(): IPlayer[] {
    return this.opponentPlayers;
  }
  public getYourTeamSelectedPlayer(): IPlayer {
    return this.yourTeamSelectedPlayer;
  }
  public getOpponentTeamSelectedPlayer(): IPlayer {
    return this.opponentTeamSelectedPlayer;
  }
}
