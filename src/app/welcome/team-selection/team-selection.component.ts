import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data.service';
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

  constructor(public teamsListService: TeamsListService, public sharedData: SharedDataService) {
    this.chosenTeamName = '';
  }

  public chooseTeam(teamName: string) {
    this.chosenTeamName = teamName;
    if(this.isYourTeam) {
      console.log("choosing your team: " + teamName);
      this.sharedData.setYourTeam(teamName);
    } else {
      console.log("choosing opponent team: " + teamName);
      this.sharedData.setOpponentTeam(teamName);
    }
    this.notifyTeamWasSelected.emit(this.isYourTeam + "|" + teamName);
  }

  public getChosenTeamName(): string {
    return this.chosenTeamName;
  }

  public setIsYourTeam(value: boolean): void {
    this.isYourTeam = value;
  }
}
