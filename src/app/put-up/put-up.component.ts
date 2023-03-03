import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPlayer } from '../interfaces/iplayer';
import { SharedDataService } from '../services/shared-data.service';

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
  
  constructor(public sharedData: SharedDataService) { }

  ngOnInit() { 
    this.yourTeam = this.sharedData.getYourTeam();
    this.opponentTeam = this.sharedData.getOpponentTeam();
    this.yourPlayers = this.sharedData.getYourTeamPlayers();
    this.opponentPlayers = this.sharedData.getOpponentTeamPlayers();
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
}
