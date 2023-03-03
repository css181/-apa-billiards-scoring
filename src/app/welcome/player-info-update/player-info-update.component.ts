import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { IPlayer } from 'src/app/interfaces/iplayer';
import { TeamsListService } from 'src/app/services/teams-list.service';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'abs-player-info-update',
  templateUrl: './player-info-update.component.html',
  styleUrls: ['./player-info-update.component.css']
})
export class PlayerInfoUpdateComponent implements OnChanges {
  @Input() teamName: string;
  @Input() isYourTeam: boolean = false;
  private oldTeamName: string;
  public players: IPlayer[];
  public isUpdateMode: boolean;
  public hasBeenConfirmed: boolean;
  @Output() notifyConfirm: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  constructor(public teamsListService: TeamsListService, public sharedData: SharedDataService) {
    this.players = [];
    this.teamName = '';
    this.oldTeamName = '';
    this.isUpdateMode = false;
    this.hasBeenConfirmed = false;
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
  
  onSave(): void {
    console.log('Saving values of players:');
    console.log(JSON.stringify(this.players));
    this.isUpdateMode = false;
  }

  onConfirm(): void {
    console.log('confirming team');
    this.hasBeenConfirmed = true;
    this.notifyConfirm.emit(this.isYourTeam);
    if(this.isYourTeam) {
      this.sharedData.setYourTeamPlayers(this.players);
    } else {
      this.sharedData.setOpponentTeamPlayers(this.players);
    }
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
  public getHasBeenConfirmed(): boolean {
    return this.hasBeenConfirmed;
  }
}
