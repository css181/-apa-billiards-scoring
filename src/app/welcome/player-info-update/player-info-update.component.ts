import { Component, Input, OnChanges } from '@angular/core';
import { IPlayer } from 'src/app/interfaces/iplayer';
import { TeamsListService } from 'src/app/services/teams-list.service';

@Component({
  selector: 'abs-player-info-update',
  templateUrl: './player-info-update.component.html',
  styleUrls: ['./player-info-update.component.css']
})
export class PlayerInfoUpdateComponent implements OnChanges {
  @Input() teamName:string;
  private players: IPlayer[];
  
  constructor(public teamsListService: TeamsListService) {
    this.players = [];
    this.teamName = '';
  }

  ngOnChanges(): void {
    if(this.teamName !== '') {
      this.teamsListService.getPlayers(this.teamName).subscribe(data => this.players=data);
    }
  }

  public getPlayers(): IPlayer[] {
    return this.players;
  }
  public getTeamName(): string {
    return this.teamName;
  }
}
