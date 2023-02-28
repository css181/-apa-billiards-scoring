import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { IPlayer } from '../../interfaces/iplayer';
import { TeamsListService } from '../../services/teams-list.service';

@Component({
  selector: 'abs-team-selection',
  templateUrl: './team-selection.component.html',
  styleUrls: ['./team-selection.component.css']
})
export class TeamSelectionComponent implements OnChanges {
  @Input() teams: string[] = [];
  @Input() isYourTeam: boolean = false;
  private players: IPlayer[];
  private chosenTeamName: string;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  constructor(public teamsListService: TeamsListService) {
    this.players = [];
    this.chosenTeamName = '';
  }

  ngOnChanges() {

  }

  public chooseTeam(teamName: string) {
    this.players = [];
    console.log("choosing team: " + teamName);
    this.chosenTeamName = teamName;
    this.notify.emit(this.isYourTeam + "|" + teamName);
    this.teamsListService.getPlayers(teamName).subscribe(data => this.players=data);
  }

  public getChosenTeamName(): string {
    return this.chosenTeamName;
  }
  public getPlayers(): IPlayer[] {
    return this.players;
  }
}
