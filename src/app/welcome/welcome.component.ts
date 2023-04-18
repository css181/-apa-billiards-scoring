import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(public teamsListService: TeamsListService, public router: Router) {
    this.teamNames = [];
  }

  ngOnInit(): void {
    this.teamNames = this.teamsListService.getNames();
  }

  onTeamSelected(message: string) {
    if(message.startsWith('true')) {
      this.yourTeam = message.substring(message.indexOf("|") + 1);
      this.setIsYourTeamConfirmed(false);
    } else {
      this.opponentTeam = message.substring(message.indexOf("|") + 1);
      this.setIsOpponentTeamConfirmed(false);
    }
  }

  onConfirmClicked(isYourTeamEvent: boolean) {
    if(isYourTeamEvent) {
      this.isYourTeamConfirmed = true;
    } else {
      this.isOpponentTeamConfirmed = true;
    }
    if(this.getYourTeam() !=='' && this.getOpponentTeam() !==''  && this.areBothTeamsConfirmed()  && (this.getYourTeam() !== this.getOpponentTeam())) {
      this.router.navigate(['/putUp']);
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
  public getIsYourTeamConfirmed(): boolean {
    return this.isYourTeamConfirmed;
  }
  public setIsOpponentTeamConfirmed(value: boolean): void {
    this.isOpponentTeamConfirmed = value;
  }
  public getIsOpponentTeamConfirmed(): boolean {
    return this.isOpponentTeamConfirmed;
  }
  public areBothTeamsConfirmed(): boolean {
    return this.isYourTeamConfirmed && this.isOpponentTeamConfirmed;
  }
}
