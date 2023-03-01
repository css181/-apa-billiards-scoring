import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { TeamsListService } from '../services/teams-list.service';

@Component({
  selector: 'abs-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit{
  private yourTeam: string = '';
  private opponentTeam: string = '';
  private teamNames: string[];

  constructor(public teamsListService: TeamsListService) {
    this.teamNames = [];
  }

  ngOnInit(): void {
    this.teamNames = this.teamsListService.getNames();
  }

  onTeamSelected(message: string) {
    if(message.startsWith('true')) {
      this.yourTeam = message.substring(message.indexOf("|") + 1);
    } else {
      this.opponentTeam = message.substring(message.indexOf("|") + 1);
    }
  }

  public getTeamNames(): string[] {
    return this.teamNames;
  }
  public setYourTeam(name: string): void {
    this.yourTeam=name;
  }
  public getYourTeam(): string {
    return this.yourTeam;
  }
  public setOpponentTeam(name: string): void {
    this.opponentTeam=name;
  }
  public getOpponentTeam(): string {
    return this.opponentTeam;
  }
}
