import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'abs-play-field',
  templateUrl: './play-field.component.html',
  styleUrls: ['./play-field.component.css']
})
export class PlayFieldComponent implements OnInit{
  @Input() yourTeam: string = '';
  @Input() opponentTeam: string = '';
  protected nextBall: number = 1;
  protected curBallImgPath: string = "assets/images/1ball.png";

  constructor(private route: ActivatedRoute) { }

  ngOnInit() { 
    this.yourTeam = this.route.snapshot.paramMap.get('yourTeam') || '';
    this.opponentTeam = this.route.snapshot.paramMap.get('opponentTeam') || '';
    // console.log('your team:' + this.yourTeam)
    // console.log('opponent team:' + this.opponentTeam)
  }

  updateNextBall(newNext: number) {
    this.nextBall = newNext;
    this.curBallImgPath = "assets/images/" + newNext + "ball.png";
  }

  public getNextBall(): number {
    return this.nextBall;
  }
  public getCurBallImgPath(): string {
    return this.curBallImgPath;
  }

  public getYourTeam(): string {
    return this.yourTeam || 'null';
  }
  public getOpponentTeam(): string {
    return this.opponentTeam || 'null';
  }
}
