import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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
  @Output() timeoutEventEmitter: EventEmitter<string> = new EventEmitter<string>();
  public firstTimeoutImg: string = 'assets/images/timeout.png';
  public secondTimeoutImg: string = 'assets/images/timeout.png';
  private newGameEventSubscription: Subscription = new Subscription;
  @Input() newGameEvent: Observable<void> = new Observable<void>;

  constructor(public sharedData: SharedDataService) {
  }
  
  ngOnInit(): void {
    if(this.isLagWinner) {
      this.currentPlayer = this.sharedData.getCurrentPlayerLagWinner();
    } else {
      this.currentPlayer = this.sharedData.getCurrentPlayerLagLoser();
    }
    if(this.currentPlayer.skill>=4) {
      this.secondTimeoutImg = 'assets/images/timeout_no.png';
    } else {
      this.secondTimeoutImg = 'assets/images/timeout.png';
    }
    this.newGameEventSubscription = this.newGameEvent.subscribe(() => this.resetTimeouts());
  }

  ngOnDestroy() {
    this.newGameEventSubscription.unsubscribe();
  }
  
  resetTimeouts() {
    this.firstTimeoutImg = 'assets/images/timeout.png';
    if(this.currentPlayer.skill<=3) {
      this.secondTimeoutImg = 'assets/images/timeout.png';
    }
  }

  onTimeoutClick(timeoutNum: number) {
    if(timeoutNum==1) {
      if(this.firstTimeoutImg.indexOf('undo')!=-1) {
        this.timeoutEventEmitter.emit('undo timeout');
        this.firstTimeoutImg = 'assets/images/timeout.png';
      } else {
        this.timeoutEventEmitter.emit('use timeout');
        this.firstTimeoutImg = 'assets/images/timeout_undo.png';
      }
    } else {
      if(this.secondTimeoutImg.indexOf('undo')!=-1) {
        this.timeoutEventEmitter.emit('undo timeout');
        this.secondTimeoutImg = 'assets/images/timeout.png';
      } else {
        this.timeoutEventEmitter.emit('use timeout');
        this.secondTimeoutImg = 'assets/images/timeout_undo.png';
      }
    }
  }

  //TODO: Add tests for this stuff
  addDefenseLagWinner() {
    this.sharedData.increaseLagWinnerDefences();
  }
  subtractDefenseLagWinner() {
    if(this.sharedData.getLagWinnerDefences() > 0)
      this.sharedData.decreaseLagWinnerDefences();
  }
  addDefenseLagLoser() {
    this.sharedData.increaseLagLoserDefences();
  }
  subtractDefenseLagLoser() {
    if(this.sharedData.getLagLoserDefences() > 0)
      this.sharedData.decreaseLagLoserDefences();
  }
}
