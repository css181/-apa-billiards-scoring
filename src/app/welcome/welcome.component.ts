import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { IPlayer } from '../interfaces/iplayer';
import { TeamsListService } from '../services/teams-list.service';

@Component({
  selector: 'abs-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit{
  private teamNames: string[];
  private players: IPlayer[];
  private chosenTeamName: string;

  constructor(public teamsListService: TeamsListService) {
    this.teamNames = [];
    this.players = [];
    this.chosenTeamName = '';
  }

  ngOnInit(): void {
    this.teamNames = this.teamsListService.getNames();
  }

  public chooseTeam(teamName: string) {
    this.players = [];
    console.log("choosing team: " + teamName);
    this.chosenTeamName = teamName;
    this.teamsListService.getPlayers(teamName).subscribe(data => this.players=data);
  }

  public getChosenTeamName(): string {
    return this.chosenTeamName;
  }
  public getTeamNames(): string[] {
    return this.teamNames;
  }
  public getPlayers(): IPlayer[] {
    return this.players;
  }
}
