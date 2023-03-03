import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { IPlayer } from '../interfaces/iplayer';
import { TeamsListService } from '../services/teams-list.service';

@Component({
  selector: 'abs-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit{
  private yourTeam: string = '';
  private yourPlayers: IPlayer[] = [];
  private opponentTeam: string = '';
  private opponentPlayers: IPlayer[] = [];
  private teamNames: string[];
  private isYourTeamConfirmed: boolean = false;
  private isOpponentTeamConfirmed: boolean = false;

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

  onConfirmClicked(isYourTeamEvent: boolean) {
    if(isYourTeamEvent) {
      this.isYourTeamConfirmed = true;
    } else {
      this.isOpponentTeamConfirmed = true;
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
  public getYourPlayers(): IPlayer[] {
    return this.yourPlayers;
  }
  public setOpponentTeam(name: string): void {
    this.opponentTeam=name;
  }
  public getOpponentTeam(): string {
    return this.opponentTeam;
  }
  public getOpponentPlayers(): IPlayer[] {
    return this.opponentPlayers;
  }

  public setIsYourTeamConfirmed(value: boolean): void {
    this.isYourTeamConfirmed = value;
  }
  public setIsOpponentTeamConfirmed(value: boolean): void {
    this.isOpponentTeamConfirmed = value;
  }
  public areBothTeamsConfirmed(): boolean {
    return this.isYourTeamConfirmed && this.isOpponentTeamConfirmed;
  }
}
