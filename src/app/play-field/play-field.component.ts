import { Component } from '@angular/core';

@Component({
  selector: 'abs-play-field',
  templateUrl: './play-field.component.html',
  styleUrls: ['./play-field.component.css']
})
export class PlayFieldComponent {
  constructor() {}
  protected nextBall: number = 1;
  protected curBallImgPath:string = "assets/images/1ball.png";

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
}
