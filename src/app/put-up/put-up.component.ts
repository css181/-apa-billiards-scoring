import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICurrentPlayer } from '../interfaces/icurrentPlayer';
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
  
  constructor(public sharedData: SharedDataService, public router: Router) { }

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

  onYourTeamWonLag(): void {
    const lagWinningPlayer = {
      id: this.yourTeamSelectedPlayer.id,
      name: this.yourTeamSelectedPlayer.name, 
      skill: this.yourTeamSelectedPlayer.skill,
      curScore: 0,
      team: this.yourTeam
    } as ICurrentPlayer
    const lagLosingPlayer = {
      id: this.opponentTeamSelectedPlayer.id,
      name: this.opponentTeamSelectedPlayer.name, 
      skill: this.opponentTeamSelectedPlayer.skill,
      curScore: 0,
      team: this.opponentTeam
    } as ICurrentPlayer
    this.sharedData.setCurrentPlayerLagWinner(lagWinningPlayer);
    this.sharedData.setCurrentPlayerLagLoser(lagLosingPlayer);
    this.router.navigate(['playField', this.yourTeam, this.opponentTeam])
  }
  onOpponentTeamWonLag(): void {
    const lagWinningPlayer = {
      id: this.opponentTeamSelectedPlayer.id,
      name: this.opponentTeamSelectedPlayer.name, 
      skill: this.opponentTeamSelectedPlayer.skill,
      curScore: 0,
      team: this.opponentTeam
    } as ICurrentPlayer
    const lagLosingPlayer = {
      id: this.yourTeamSelectedPlayer.id,
      name: this.yourTeamSelectedPlayer.name, 
      skill: this.yourTeamSelectedPlayer.skill,
      curScore: 0,
      team: this.yourTeam
    } as ICurrentPlayer
    this.sharedData.setCurrentPlayerLagWinner(lagWinningPlayer);
    this.sharedData.setCurrentPlayerLagLoser(lagLosingPlayer);
    this.router.navigate(['playField', this.yourTeam, this.opponentTeam])
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
