import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ICurrentPlayer } from 'src/app/interfaces/icurrentPlayer';
import { IGame } from 'src/app/interfaces/igame';
import { IInning } from 'src/app/interfaces/iInnings';
import { IMatch } from 'src/app/interfaces/iMatch';
import { ITurn } from 'src/app/interfaces/iTurn';
import { SharedDataService } from 'src/app/services/shared-data.service';
import DefenseGoneBadPlayers from '../../../assets/data/defense-gone-bad-players.json'
import HookerPlayers from '../../../assets/data/hookers-players.json';
import { BallsComponent } from './balls.component';

describe('BallsComponent', () => {
  let component: BallsComponent;
  let fixture: ComponentFixture<BallsComponent>;
  const yourPlayer = DefenseGoneBadPlayers[0];
  const opponentPlayer = HookerPlayers[0];
  let matchIndex: number;
  let gameIndex: number;
  let inningIndex: number;

  class RouterStub {
    url = '';
    navigate(commands: any[], extras?: any) { }
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({ 
      declarations: [ BallsComponent ],
      providers: [ SharedDataService, { provide: Router, useClass: RouterStub } ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BallsComponent);
    component = fixture.componentInstance;
    
    //Fake out what would be in the lag at the start of this component
    component.sharedData.addMatchToLog(yourPlayer, opponentPlayer);
    component.sharedData.addGameToMatch({innings:[{lagWinnerTurn: {name: yourPlayer.name, ballsSunk:[], deadBalls:[], timeouts: 0} as ITurn} as IInning]} as IGame, 0);
    
    matchIndex = component.sharedData.getCurrentMatchIndex();
    gameIndex = component.sharedData.getCurrentGameIndex();
    inningIndex = component.sharedData.getCurrentInningIndex();
    fixture.detectChanges();
  });

  it('should display the table of all the ball images', () => {
    const ballTable = fixture.debugElement.query(By.css('table#balls'));
    const imgs = ballTable.queryAll(By.css('.ball'));

    for (var x = 1; x < 10; x++) {
      expect(imgs[x - 1].nativeElement.src).toContain(x + "ball.png");
    }
  });

  it('should contain a lage display of the next ball to hit', () => {
    const upNextImg = fixture.debugElement.query(By.css('.up-next'));
    expect(upNextImg).toBeTruthy;
  })

  describe('updateNextBall() method', () => {
    it('should update the nextBall state of the component', () => {
      expect(component.getNextBall()).toBe(1);

      component.updateNextBall(1);

      expect(component.getNextBall()).toBe(2);
    })

    it('should change the large display of the next ball to hit', () => {
      const upNextImg = fixture.debugElement.query(By.css('.up-next'));
      expect(upNextImg.nativeElement.src).toContain("1ball.png");

      component.updateNextBall(1);
      fixture.detectChanges();
      expect(upNextImg.nativeElement.src).toContain("2ball.png");
    })
  })

  describe('When clicking the large current ball', () => {
    it('should update the image to the next ball', () => {
      const upNextImg = fixture.debugElement.query(By.css('.up-next'));
      expect(upNextImg.nativeElement.src).toContain("1ball.png");

      clickUpNextImg();

      expect(upNextImg.nativeElement.src).toContain("2ball.png");
    })
    it('should reset back to 1 ball and reset sunkBallList if it was on the 9', () => {
      const upNextImg = fixture.debugElement.query(By.css('.up-next'));
      component.nextBall = 9;
      component.sunkBallsList = [1,2,3,4,5,6,7,8];
      component.curBallImgPath = "assets/images/9ball.png";

      clickUpNextImg();
      
      expect(upNextImg.nativeElement.src).toContain("1ball.png");
      expect(component.sunkBallsList.length).toBe(0);
    })
    it('should add 1 point to the current shooter when ball is 1 through 8, and add each ball to the ballsSunk list in the log', () => {
      setupLagWinnerAndLoser();
      const upNextImg = fixture.debugElement.query(By.css('.up-next'));
      expect(upNextImg.nativeElement.src).toContain("1ball.png");
      expect(component.curShootingPlayer.curScore).toBe(0);

      //1ball
      clickUpNextImg();
      expect(component.curShootingPlayer.curScore).toBe(1);
      expect(component.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagWinnerTurn.ballsSunk).toEqual([1]);
      
      //2ball
      clickUpNextImg();
      expect(component.curShootingPlayer.curScore).toBe(2);
      expect(component.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagWinnerTurn.ballsSunk).toEqual([1,2]);
      
      //3ball
      clickUpNextImg();
      expect(component.curShootingPlayer.curScore).toBe(3);
      expect(component.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagWinnerTurn.ballsSunk).toEqual([1,2,3]);
      
      //4ball
      clickUpNextImg();
      expect(component.curShootingPlayer.curScore).toBe(4);
      expect(component.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagWinnerTurn.ballsSunk).toEqual([1,2,3,4]);
      
      //5ball
      clickUpNextImg();
      expect(component.curShootingPlayer.curScore).toBe(5);
      expect(component.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagWinnerTurn.ballsSunk).toEqual([1,2,3,4,5]);
      
      //6ball
      clickUpNextImg();
      expect(component.curShootingPlayer.curScore).toBe(6);
      expect(component.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagWinnerTurn.ballsSunk).toEqual([1,2,3,4,5,6]);
      
      //7ball
      clickUpNextImg();
      expect(component.curShootingPlayer.curScore).toBe(7);
      expect(component.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagWinnerTurn.ballsSunk).toEqual([1,2,3,4,5,6,7]);
      
      //8ball
      clickUpNextImg();
      expect(component.curShootingPlayer.curScore).toBe(8);
      expect(component.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagWinnerTurn.ballsSunk).toEqual([1,2,3,4,5,6,7,8]);
    })
    describe('when the lagWinner is shooting the 9 ball', ()=> {
      beforeEach(()=>{
        setupLagWinnerAndLoser();
        component.nextBall = 9;
        component.curBallImgPath = "assets/images/9ball.png";
      })
      it('should add 2 point to the current shooter', () => {
        expect(component.curShootingPlayer.curScore).toBe(0);
        //9ball
        clickUpNextImg();
  
        expect(component.curShootingPlayer.curScore).toBe(2);
        expect(component.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagWinnerTurn.ballsSunk).toEqual([9]);
      })
      it('should emit a newGameEvent', ()=> {
        spyOn(component.newGameEventEmitter, 'emit');
        //9ball
        clickUpNextImg();

        expect(component.newGameEventEmitter.emit).toHaveBeenCalled();
      })
    })
    describe('when the lagLoser is shooting the 9 ball', ()=> {
      beforeEach(()=>{
        setupLagWinnerAndLoser();
        clickEndTurnButton();
        component.nextBall = 9;
        component.curBallImgPath = "assets/images/9ball.png";
      })
      it('should add 2 point to the lagLoser and add that ball to ballsSunk of the lagLoser log', () => {
        expect(component.curShootingPlayer.curScore).toBe(0);
  
        //9ball
        clickUpNextImg();
        expect(component.curShootingPlayer.curScore).toBe(2);
        expect(component.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagLoserTurn.ballsSunk).toEqual([9]);
      })
      it('should emit a newGameEvent', ()=> {
        spyOn(component.newGameEventEmitter, 'emit');
        //9ball
        clickUpNextImg();

        expect(component.newGameEventEmitter.emit).toHaveBeenCalled();
      })
    })
    it('should add the current ball to the sunkBallList', ()=> {
      expect(component.sunkBallsList.length).toBe(0);

      clickUpNextImg(); //1ball
      clickUpNextImg(); //2ball

      expect(component.sunkBallsList).toContain(1);
      expect(component.sunkBallsList).toContain(2);
    })
    it('should update the current next ball to the next one not sunk if the current ball is clicked combo/carem', ()=> {
      component.nextBall = 3;
      component.curBallImgPath = "assets/images/3ball.png";
      component.sunkBallsList = [1,2,4,5];
      
      clickUpNextImg();

      expect(component.nextBall).toBe(6);
      expect(component.curBallImgPath).toContain('6ball.png');
    })
    it('does nothing when isDeadBallMode=true and has opacity < 1', ()=> {
      expect(component.curShootingPlayer.curScore).toBe(0);
      expect(component.nextBall).toBe(1);
      component.isDeadBallMode = true;
      fixture.detectChanges();

      clickUpNextImg();

      expect(component.curShootingPlayer.curScore).toBe(0);
      expect(component.nextBall).toBe(1);
      const upNextImg = fixture.debugElement.query(By.css('.up-next')).nativeElement;
      expect(getComputedStyle(upNextImg).opacity).toBeLessThan(1);
    })
  })

  describe('currently shooting player', () => {
    it('should start as the lag winning player', () => {
      setupLagWinnerAndLoser();

      expect(component.curShootingPlayer).toEqual(component.sharedData.getCurrentPlayerLagWinner());
    })
    it('should be prominantly displayed', () => {
      setupLagWinnerAndLoser();

      const element = fixture.debugElement.query(By.css('#curShootingPlayerInfo')).nativeElement; 
      expect(element).toBeTruthy();
      expect(element.textContent).toContain(component.curShootingPlayer.name);
    })

    describe('when "End Turn" button is pressed', () => {
      it('should swap the currently shooting player', () => {
        setupLagWinnerAndLoser();

        //Go from Winner to Loser
        clickEndTurnButton();

        expect(component.curShootingPlayer).toEqual(component.sharedData.getCurrentPlayerLagLoser());
        expect(fixture.debugElement.query(By.css('#curShootingPlayerInfo')).nativeElement.textContent).toContain(component.curShootingPlayer.name);

        //Go from Loser to Winner
        clickEndTurnButton();

        expect(component.curShootingPlayer).toEqual(component.sharedData.getCurrentPlayerLagWinner());
        expect(fixture.debugElement.query(By.css('#curShootingPlayerInfo')).nativeElement.textContent).toContain(component.curShootingPlayer.name);
      })
      describe('and the lagWinner was shooting', ()=> {
        it('should add a new turn to the log for the lagLoser with empty list for ballsSunk and deadBalls', ()=> {
          setupLagWinnerAndLoser();
          clickEndTurnButton();
          
          expect(component.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagLoserTurn).toEqual({name: component.getLagLosingPlayer().name, ballsSunk: [], deadBalls: [], timeouts: 0} as ITurn)
        })
      })
      describe('and the lagLoser was shooting', () => {
        beforeEach(()=>{
          setupLagWinnerAndLoser();
          //Go from Winner to Loser
          clickEndTurnButton();
          //No inning is added
          expect(component.sharedData.getCurrentInningIndex()).toBe(0);
        })
        it('should add an inning', () => {
          //Go from Loser to Winner
          clickEndTurnButton();
  
          expect(component.sharedData.getCurrentInningIndex()).toBe(1);
        })
        it('should add a new inning with a new turn to the log for the lagWinner with empty list for ballsSunk and deadBalls', ()=> {
          //Go from Loser to Winner
          clickEndTurnButton();
          
          expect(component.sharedData.getCurrentInningIndex()).toBe(inningIndex+1);
          expect(component.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex+1].lagWinnerTurn).toEqual({name: component.getLagWinningPlayer().name, ballsSunk: [], deadBalls: [], timeouts: 0} as ITurn);
        })
      })
      describe('and isDeadBallMode=true', ()=> {
        beforeEach(()=> {
          component.isDeadBallMode = true;
        })
        it('should reset isDeadBallMode back to false', ()=> {
          clickEndTurnButton();

          expect(component.isDeadBallMode).toBeFalse();
        })
      })
    })
  })

  describe('row of balls 1 through 9 at the bottom', () => {
    it('should start in not-isDeadBallMode, and clicking deadBallMode button will switch to isDeadBallMode', () => {
      expect(component.isDeadBallMode).toBeFalse();

      clickDeadBallModeButton();

      expect(component.isDeadBallMode).toBeTrue();
    })

    describe('when isDeadBallMode is true', ()=> {
      beforeEach(()=> {
        clickDeadBallModeButton();
      })
      it('should show the 9 ball can not die image', ()=> {
        const ball9 = fixture.debugElement.query(By.css('#ball9'));
        expect(ball9.nativeElement.src).toContain("9ball_dead.png");
      })
      it('should not impact score, dead ball count, or image when the 9ball is clicked (because it can not die)', ()=> {
        const score = component.curShootingPlayer.curScore;
        const deadBallCount = component.sharedData.getGameDeadBallCount();
        const curImg = fixture.debugElement.query(By.css('.up-next')).nativeElement.src;

        const ball9 = fixture.debugElement.query(By.css('#ball9'));
        ball9.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(component.curShootingPlayer.curScore).toBe(score);
        expect(component.sharedData.getGameDeadBallCount()).toBe(deadBallCount);
        expect(fixture.debugElement.query(By.css('.up-next')).nativeElement.src).toBe(curImg);
      })
      it('should add a dead ball for each ball that gets clicked (other than the 9 which can not die)', ()=> {
        expect(component.sharedData.getGameDeadBallCount()).toBe(0);
        const ball1 = fixture.debugElement.query(By.css("#ball1"));
        ball1.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(component.sharedData.getGameDeadBallCount()).toBe(1);
        expect(component.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagWinnerTurn).toEqual({name: component.getLagWinningPlayer().name, ballsSunk: [], deadBalls: [1], timeouts: 0} as ITurn);

        //And again for 2 ball
        const ball2 = fixture.debugElement.query(By.css("#ball2"));
        ball2.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(component.sharedData.getGameDeadBallCount()).toBe(2);
        expect(component.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagWinnerTurn).toEqual({name: component.getLagWinningPlayer().name, ballsSunk: [], deadBalls: [1,2], timeouts: 0} as ITurn);
      })
      describe('when the lagLoser is shooting', ()=> {
        beforeEach(()=>{
          setupLagWinnerAndLoser();
          clickEndTurnButton();
          clickDeadBallModeButton();
        })
        it('should add a dead ball for each ball that gets clicked to the lagLoser log', ()=> {
          expect(component.sharedData.getGameDeadBallCount()).toBe(0);
          const ball1 = fixture.debugElement.query(By.css("#ball1"));
          ball1.triggerEventHandler('click', null);
          fixture.detectChanges();
  
          expect(component.sharedData.getGameDeadBallCount()).toBe(1);
          expect(component.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagLoserTurn).toEqual({name: component.getLagLosingPlayer().name, ballsSunk: [], deadBalls: [1], timeouts: 0} as ITurn);
  
          //And again for 2 ball
          const ball2 = fixture.debugElement.query(By.css("#ball2"));
          ball2.triggerEventHandler('click', null);
          fixture.detectChanges();
  
          expect(component.sharedData.getGameDeadBallCount()).toBe(2);
          expect(component.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagLoserTurn).toEqual({name: component.getLagLosingPlayer().name, ballsSunk: [], deadBalls: [1,2], timeouts: 0} as ITurn);
        })
      })
      it('should add the balls number to the sunkBalls list when clicked and change that balls opacity to less than 0.5', ()=> {
        const ball1 = fixture.debugElement.query(By.css("#ball1"));
        expect(getComputedStyle(ball1.nativeElement).opacity).toBeGreaterThanOrEqual(0.5);
        expect(component.sunkBallsList.length).toBe(0);

        ball1.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(getComputedStyle(ball1.nativeElement).opacity).toBeLessThan(0.5);
        expect(component.sunkBallsList).toContain(1);
      })
      it('should should not add another dead ball if the same dead ball is clicked multiple times', ()=> {
        const ball1 = fixture.debugElement.query(By.css("#ball1"));
        expect(component.sharedData.getGameDeadBallCount()).toBe(0);
        ball1.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(component.sharedData.getGameDeadBallCount()).toBe(1);

        ball1.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(component.sharedData.getGameDeadBallCount()).toBe(1);
      })
      it('should not update the current next ball if a different ball is clicked dead', ()=> {
        expect(component.nextBall).toBe(1);

        const ball2 = fixture.debugElement.query(By.css("#ball2"));
        ball2.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(component.nextBall).toBe(1);
      })
      it('should update the current next ball to the next one not sunk if the current ball is clicked dead', ()=> {
        component.nextBall = 3;
        component.sunkBallsList = [1,2,4,5];

        const ball3 = fixture.debugElement.query(By.css("#ball3"));
        ball3.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(component.nextBall).toBe(6);
      })
    })

    describe('when isDeadBallMode is false', ()=> {
      it('should display the balls with opacity = 1', ()=> {
        const ball1Img = fixture.debugElement.query(By.css("#ball1")).nativeElement;
        expect(getComputedStyle(ball1Img).opacity).toEqual('1');
      })
      it('should add the balls number to the sunkBalls list when clicked and change that balls opacity to less than 0.5', ()=> {
        const ball1 = fixture.debugElement.query(By.css("#ball1"));
        expect(getComputedStyle(ball1.nativeElement).opacity).toBeGreaterThanOrEqual(0.5);
        expect(component.sunkBallsList.length).toBe(0);

        ball1.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(getComputedStyle(ball1.nativeElement).opacity).toBeLessThan(0.5);
        expect(component.sunkBallsList).toContain(1);
      })
      it('should should add 1 point if the 2 through 8 ball are carem/combod, and update the ballsSunk in the log with that ball', ()=> {
        const ball2 = fixture.debugElement.query(By.css("#ball2"));
        expect(component.curShootingPlayer.curScore).toBe(0);

        ball2.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(component.curShootingPlayer.curScore).toBe(1);
        expect(component.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagWinnerTurn.ballsSunk).toEqual([2]);
      })
      describe('when the lagLoser is shooting', ()=> {
        beforeEach(()=>{
          setupLagWinnerAndLoser();
          clickEndTurnButton();
        })
        it('should should add 1 point to the lagLoser if the 2 through 8 ball are carem/combod, and update the ballsSunk in the log with that ball', ()=> {
          const ball2 = fixture.debugElement.query(By.css("#ball2"));
          expect(component.curShootingPlayer.curScore).toBe(0);
  
          ball2.triggerEventHandler('click', null);
          fixture.detectChanges();
  
          expect(component.curShootingPlayer.curScore).toBe(1);
          expect(component.sharedData.getLog()[matchIndex].games[gameIndex].innings[inningIndex].lagLoserTurn.ballsSunk).toEqual([2]);
        })
      })
      it('should should not add more points if the same carem/combo ball is clicked multiple times', ()=> {
        const ball1 = fixture.debugElement.query(By.css("#ball1"));
        expect(component.curShootingPlayer.curScore).toBe(0);
        ball1.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(component.curShootingPlayer.curScore).toBe(1);

        ball1.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(component.curShootingPlayer.curScore).toBe(1);
      })
      it('should not update the current next ball if a different ball is clicked combo/carem', ()=> {
        expect(component.nextBall).toBe(1);

        const ball2 = fixture.debugElement.query(By.css("#ball2"));
        ball2.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(component.nextBall).toBe(1);
      })
      it('should update the current next ball to the next one not sunk if the current ball is clicked combo/carem', ()=> {
        component.nextBall = 3;
        component.sunkBallsList = [1,2,4,5];

        const ball3 = fixture.debugElement.query(By.css("#ball3"));
        ball3.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(component.nextBall).toBe(6);
      })
      it('should add 2 points, reset nextball to 1, and reset sunkBallList to empty when 9 is clicked combo/carem', ()=> {
        component.nextBall = 3;
        component.sunkBallsList = [1,2,4,5];
        expect(component.curShootingPlayer.curScore).toBe(0);

        const ball9 = fixture.debugElement.query(By.css("#ball9"));
        ball9.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(component.curShootingPlayer.curScore).toBe(2);
        expect(component.nextBall).toBe(1);
        expect(component.sunkBallsList.length).toBe(0);
      })
      describe('when the lagWinner is shooting and 9 ball is carem/combod', ()=> {
        beforeEach(()=>{
          setupLagWinnerAndLoser();
          component.sharedData.incrementDeadBall();
          spyOn(component.newGameEventEmitter, 'emit');
          const ball9 = fixture.debugElement.query(By.css("#ball9"));
          ball9.triggerEventHandler('click', null);
          fixture.detectChanges();
        })
        it('should emit a newGameEvent', ()=> {
          expect(component.newGameEventEmitter.emit).toHaveBeenCalled();
        })
      })
      describe('when the lagLoser is shooting and the 9 ball is carem/combod', ()=> {
        beforeEach(()=>{
          setupLagWinnerAndLoser();
          clickEndTurnButton();
          component.sharedData.incrementDeadBall();
          spyOn(component.newGameEventEmitter, 'emit');
          const ball9 = fixture.debugElement.query(By.css("#ball9"));
          ball9.triggerEventHandler('click', null);
          fixture.detectChanges();
        })
        it('should emit a newGameEvent', ()=> {
          expect(component.newGameEventEmitter.emit).toHaveBeenCalled();
        })
      })
    })
  })

  describe('because this component can be re-loaded from coming back from match-log', ()=> {
    describe('when loading this component', ()=> {
      beforeEach(()=>{
        const fullInning = { lagWinnerTurn: {ballsSunk: [1,2], deadBalls: [5], name: HookerPlayers[0].name} as ITurn,
        lagLoserTurn: {ballsSunk: [3,4], deadBalls: [6], name: HookerPlayers[1].name} as ITurn } as IInning;
        const game = {innings: [fullInning]} as IGame;
        const match = {lagWinner: HookerPlayers[0], lagLoser: HookerPlayers[1], games: [ game ] } as IMatch;
        const matchList = [match] as IMatch[];
        component.sharedData.setLog(matchList);
        component.sharedData.setCurrentPlayerLagWinner(HookerPlayers[0] as ICurrentPlayer);
        component.sharedData.setCurrentPlayerLagLoser(HookerPlayers[1] as ICurrentPlayer);
      })
      it('should load the sunkBallsList from all ballsSunk and deadballs in the log this game', ()=> {
        component.ngOnInit();
        expect(component.sunkBallsList).toEqual([1,2,5,3,4,6]);
      })
      it('should load the nextBall by assigning it after re-reading in the sunkBallList', ()=> {
        component.ngOnInit();
        expect(component.nextBall).toBe(7);
      })
      it('should load the current shooter from whoever is last in the log', ()=> {
        component.ngOnInit();
        expect(component.curShootingPlayer).toEqual(HookerPlayers[1] as ICurrentPlayer);

        const halfInning = { lagWinnerTurn: {ballsSunk: [1,2], deadBalls: [5], name: HookerPlayers[0].name} as ITurn} as IInning;
        component.sharedData.addInningToLog(halfInning);
        component.ngOnInit();
        expect(component.curShootingPlayer).toEqual(HookerPlayers[0] as ICurrentPlayer);
      })
    })
  })

  function setupLagWinnerAndLoser() {
    const yourCurrentPlayer = {id: yourPlayer.id, name: yourPlayer.name, skill: yourPlayer.skill, team: 'Defense Gone Bad', curScore: 0} as ICurrentPlayer
    const opponentCurrentPlayer = {id: opponentPlayer.id, name: opponentPlayer.name, skill: opponentPlayer.skill, team: 'Hookers', curScore: 0} as ICurrentPlayer
    component.sharedData.setCurrentPlayerLagWinner(yourCurrentPlayer);
    component.sharedData.setCurrentPlayerLagLoser(opponentCurrentPlayer);
    component.ngOnInit();
    fixture.detectChanges();
  }

  function clickEndTurnButton() {
    let button = fixture.debugElement.query(By.css('button#endTurn'));
    button.triggerEventHandler('click', null);
    fixture.detectChanges();
  }
  function clickUpNextImg() {
    const upNextImg = fixture.debugElement.query(By.css('#up-nextBall'));
    upNextImg.triggerEventHandler('click', null);
    fixture.detectChanges();
  }
  function clickDeadBallModeButton() {
    let button = fixture.debugElement.query(By.css('button#deadBallMode'));
    button.triggerEventHandler('click', null);
    fixture.detectChanges();
  }
});
