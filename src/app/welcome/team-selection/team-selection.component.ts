import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { IPlayer } from '../../interfaces/iplayer';
import { TeamsListService } from '../../services/teams-list.service';

@Component({
  selector: 'abs-team-selection',
  templateUrl: './team-selection.component.html',
  styleUrls: ['./team-selection.component.css']
})
export class TeamSelectionComponent {
  @Input() teams: string[] = [];
  @Input() isYourTeam: boolean = false;
  private chosenTeamName: string;
  @Output() notifyTeamWasSelected: EventEmitter<string> = new EventEmitter<string>();

  constructor(public teamsListService: TeamsListService) {
    this.chosenTeamName = '';
  }

  public chooseTeam(teamName: string) {
    console.log("choosing " + (this.isYourTeam?"your ":"opponent ") + " team: " + teamName);
    this.chosenTeamName = teamName;
    this.notifyTeamWasSelected.emit(this.isYourTeam + "|" + teamName);
  }

  public getChosenTeamName(): string {
    return this.chosenTeamName;
  }

}
