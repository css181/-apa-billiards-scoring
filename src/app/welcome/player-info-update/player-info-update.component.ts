import { Component, Input, OnChanges } from '@angular/core';
import { IPlayer } from 'src/app/interfaces/iplayer';
import { TeamsListService } from 'src/app/services/teams-list.service';

@Component({
  selector: 'abs-player-info-update',
  templateUrl: './player-info-update.component.html',
  styleUrls: ['./player-info-update.component.css']
})
export class PlayerInfoUpdateComponent implements OnChanges {
  @Input() teamName: string;
  private oldTeamName: string;
  private players: IPlayer[];
  public isUpdateMode: boolean;
  
  constructor(public teamsListService: TeamsListService) {
    this.players = [];
    this.teamName = '';
    this.oldTeamName = '';
    this.isUpdateMode = false;
  }

  ngOnChanges(): void {
    //TODO: Try to do this in a better way than storing an old teamName
    if(this.teamName !== '' && (this.teamName !== this.oldTeamName)) {
      this.oldTeamName = this.teamName;
      this.isUpdateMode = false;
      this.teamsListService.getPlayers(this.teamName).subscribe(data => this.players=data);
    }
  }

  onUpdate(): void {
    this.isUpdateMode = true;
    console.log('setting isUpdateMode to true');
  }

  public getPlayers(): IPlayer[] {
    return this.players;
  }
  public getTeamName(): string {
    return this.teamName;
  }
  public getIsUpdateMode(): boolean {
    return this.isUpdateMode;
  }
}
