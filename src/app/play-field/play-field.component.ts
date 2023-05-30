import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICurrentPlayer } from '../interfaces/icurrentPlayer';
import { SharedDataService } from '../services/shared-data.service';
import DefenseGoneBadPlayers from '../../assets/data/defense-gone-bad-players.json'
import HookerPlayers from '../../assets/data/hookers-players.json';
import { IInning } from '../interfaces/iInnings';
import { ITurn } from '../interfaces/iTurn';
import { IGame } from '../interfaces/igame';

@Component({
  selector: 'abs-play-field',
  templateUrl: './play-field.component.html',
  styleUrls: ['./play-field.component.css']
})
export class PlayFieldComponent implements OnInit{
  @Input() yourTeam: string = '';
  @Input() opponentTeam: string = '';

  //TODO: Remove later, setting defaults for easy manual testing purposes
  private yourPlayer = DefenseGoneBadPlayers[0];
  private opponentPlayer = HookerPlayers[0];
  private yourCurrentPlayer = {id: this.yourPlayer.id, name: this.yourPlayer.name, skill: this.yourPlayer.skill, team: 'Defense Gone Bad', curScore: 0} as ICurrentPlayer
  private opponentCurrentPlayer = {id: this.opponentPlayer.id, name: this.opponentPlayer.name, skill: this.opponentPlayer.skill, team: 'Hookers', curScore: 0} as ICurrentPlayer
  
  private lagLosingPlayer: ICurrentPlayer = this.opponentCurrentPlayer;//{} as ICurrentPlayer;
  private lagWinningPlayer: ICurrentPlayer = this.yourCurrentPlayer;//{} as ICurrentPlayer;

  //TODO: these need to be retrieved/stored from what's in the Log in sharedData
  public deadBalls: number = 0;


  //TODO: remove
  public isPrintLogMode: boolean = false;

  constructor(public sharedData: SharedDataService, private route: ActivatedRoute) { }

  ngOnInit() { 
    this.yourTeam = this.route.snapshot.paramMap.get('yourTeam') || '';
    this.opponentTeam = this.route.snapshot.paramMap.get('opponentTeam') || '';
    
    //TODO: For easy testing purposes, set the shared data to our test info
    this.setupComponentForLocalTestingByDefaultingSharedData();
    
    this.lagLosingPlayer = this.sharedData.getCurrentPlayerLagLoser();
    this.lagWinningPlayer = this.sharedData.getCurrentPlayerLagWinner();
  }

  setupComponentForLocalTestingByDefaultingSharedData(): void {
    if(this.sharedData.getCurrentPlayerLagLoser().name===undefined) {
      this.sharedData.setCurrentPlayerLagLoser(this.opponentCurrentPlayer);
    }
    if(this.sharedData.getCurrentPlayerLagWinner().name===undefined) {
      this.sharedData.setCurrentPlayerLagWinner(this.yourCurrentPlayer);
    }
    if(this.sharedData.getLog().length===0) {
      this.sharedData.addMatchToLog(this.yourCurrentPlayer, this.opponentCurrentPlayer);
      this.sharedData.addGameToMatch({innings:[{lagWinnerTurn: {name: this.yourCurrentPlayer.name, ballsSunk:[], deadBalls:[]} as ITurn} as IInning]} as IGame, 0);
    }
  }

  onPrintLog() {
    this.isPrintLogMode=!this.isPrintLogMode;
  }
  
  onAddInning(): void {
    const lagWinnerTurn = {ballsSunk:[], deadBalls:[], name:this.lagWinningPlayer.name} as ITurn;
    const lagLoserTurn = {ballsSunk:[], deadBalls:[], name:this.lagLosingPlayer.name} as ITurn;
    const newInning = {lagWinnerTurn: lagWinnerTurn, lagLoserTurn: lagLoserTurn} as IInning;
    this.sharedData.addInningToLog(newInning);
  }
  onDecrementInning(): void {
    this.sharedData.decrementInning();
  }
  onAddDeadBall(): void {
    this.deadBalls++;
  }
  onDecrementDeadBall(): void {
    if(this.deadBalls > 0)
      this.deadBalls--;
  }


  public getYourTeam(): string {
    return this.yourTeam || 'null';
  }
  public getOpponentTeam(): string {
    return this.opponentTeam || 'null';
  }

  public getLagWinningPlayer(): ICurrentPlayer {
    return this.lagWinningPlayer;
  }
  public getLagLosingPlayer(): ICurrentPlayer {
    return this.lagLosingPlayer;
  }
}
