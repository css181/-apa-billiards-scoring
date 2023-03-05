import { Component, Input, OnInit } from '@angular/core';
import { ICurrentPlayer } from 'src/app/interfaces/icurrentPlayer';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'abs-current-player-score',
  templateUrl: './current-player-score.component.html',
  styleUrls: ['./current-player-score.component.css']
})
export class CurrentPlayerScoreComponent implements OnInit{
  @Input() isLagWinner: boolean = false;
  public currentPlayer: ICurrentPlayer = {id:'', name:'', skill:0, team:''} as ICurrentPlayer;
  
  constructor(public sharedData: SharedDataService) {}
  
  ngOnInit(): void {
    if(this.isLagWinner) {
      this.currentPlayer = this.sharedData.getCurrentPlayerLagWinner();
    } else {
      this.currentPlayer = this.sharedData.getCurrentPlayerLagLoser();
    }
  }
  
  getTargetScore(skill: number): number {
    let target:number = 0;
    switch (skill) {
      case 1:
        target=14; break;
      case 2:
        target=19; break;
      case 3:
        target=24; break;
      case 4:
        target=31; break;
      case 5:
        target=38; break;
      case 6:
        target=45; break;
      case 7:
        target=52; break;
      case 8:
        target=60; break;
      case 9:
        target=72; break;
      default:
        break;
    }
    return target;
  }
}
