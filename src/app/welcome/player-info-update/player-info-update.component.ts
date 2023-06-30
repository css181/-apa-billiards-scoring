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
      this.hasBeenConfirmed = false;
      this.teamsListService.getPlayers(this.teamName).subscribe(data => this.players=data);
    }
  }

  onUpdate(): void {
    this.isUpdateMode = true;
    // console.log('setting isUpdateMode to true');
  }

  onSkillChange(newValue: any): void {
    newValue = parseInt(newValue);
  }
  
  onSave(): void {
    // console.log('Saving values of players:');
    // console.log(JSON.stringify(this.players));
    let areAllValidSkills = true;
    for (let index = 0; index < this.players.length; index++) {
      const element = this.players[index];
      if(element.skill<1) {
        alert('Player: ' + element.name + ' can not have a skill below 1.  Current [' + element.skill + ']');
        areAllValidSkills = false;
      }
      if(element.skill>9) {
        alert('Player: ' + element.name + ' can not have a skill above 9.  Current [' + element.skill + ']');
        areAllValidSkills = false;
      }
    }
    if(areAllValidSkills) {
      this.isUpdateMode = false;
    }
  }

  onConfirm(): void {
    // console.log('confirming team');
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
