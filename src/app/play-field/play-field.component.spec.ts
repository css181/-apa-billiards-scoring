import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from "@angular/platform-browser"
import { ActivatedRoute } from '@angular/router';
import DefenseGoneBadPlayers from '../../assets/data/defense-gone-bad-players.json'
import HookerPlayers from '../../assets/data/hookers-players.json';
import { ICurrentPlayer } from '../interfaces/icurrentPlayer';
import { SharedDataService } from '../services/shared-data.service';
import { PlayFieldComponent } from './play-field.component';

describe('PlayFieldComponent', () => {
  let component: PlayFieldComponent;
  let fixture: ComponentFixture<PlayFieldComponent>;

  const mockParamMap = { get(attrib: string):string { return 'Defense Gone Bad'}}
  const fakeActivatedRoute = {
    snapshot: { 
      paramMap: mockParamMap
    }
  } as unknown as ActivatedRoute;


  beforeEach(async () => {
    TestBed.configureTestingModule({ 
      declarations: [ PlayFieldComponent ],
      providers: [ SharedDataService, {provide: ActivatedRoute, useValue: fakeActivatedRoute} ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //TEMPORARY TESTS
  it('should display the team names', () => {
    expect(fixture.debugElement.query(By.css('p#yourTeam')).nativeElement.textContent).toContain(component.getYourTeam());
    expect(fixture.debugElement.query(By.css('p#opponentTeam')).nativeElement.textContent).toContain(component.getOpponentTeam());
  })


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

      component.updateNextBall(2);

      expect(component.getNextBall()).toBe(2);
    })

    it('should change the large display of the next ball to hit', () => {
      const upNextImg = fixture.debugElement.query(By.css('.up-next'));
      expect(upNextImg.nativeElement.src).toContain("1ball.png");

      component.updateNextBall(2);
      fixture.detectChanges();
      expect(upNextImg.nativeElement.src).toContain("2ball.png");
    })
  })

  describe('When clicking the large current ball', () => {
    it('should update the image to the next ball', () => {
      const upNextImg = fixture.debugElement.query(By.css('.up-next'));
      expect(upNextImg.nativeElement.src).toContain("1ball.png");

      upNextImg.triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(upNextImg.nativeElement.src).toContain("2ball.png");
    })
    it('should reset back to 1 ball if it was on the 9', () => {
      const upNextImg = fixture.debugElement.query(By.css('.up-next'));
      component.nextBall = 9;
      component.curBallImgPath = "assets/images/9ball.png";

      upNextImg.triggerEventHandler('click', null);
      fixture.detectChanges();
      
      expect(upNextImg.nativeElement.src).toContain("1ball.png");
    })
    it('shoudl add 1 point to the current shooter when ball is 1 through 8', () => {
      setupLagWinnerAndLoser();
      const upNextImg = fixture.debugElement.query(By.css('.up-next'));
      expect(upNextImg.nativeElement.src).toContain("1ball.png");
      expect(component.curShootingPlayer.curScore).toBe(0);

      //1ball
      upNextImg.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.curShootingPlayer.curScore).toBe(1);
      
      //2ball
      upNextImg.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.curShootingPlayer.curScore).toBe(2);
      
      //3ball
      upNextImg.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.curShootingPlayer.curScore).toBe(3);
      
      //4ball
      upNextImg.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.curShootingPlayer.curScore).toBe(4);
      
      //5ball
      upNextImg.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.curShootingPlayer.curScore).toBe(5);
      
      //6ball
      upNextImg.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.curShootingPlayer.curScore).toBe(6);
      
      //7ball
      upNextImg.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.curShootingPlayer.curScore).toBe(7);
      
      //8ball
      upNextImg.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.curShootingPlayer.curScore).toBe(8);
    })
    it('shoudl add 2 point to the current shooter when ball was 9', () => {
      setupLagWinnerAndLoser();
      const upNextImg = fixture.debugElement.query(By.css('.up-next'));
      component.nextBall = 9;
      component.curBallImgPath = "assets/images/9ball.png";
      expect(component.curShootingPlayer.curScore).toBe(0);

      //9ball
      upNextImg.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.curShootingPlayer.curScore).toBe(2);
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
      describe('and the lagLoser was shooting', () => {
        it('should add an inning', () => {
          setupLagWinnerAndLoser();
  
          //Go from Winner to Loser
          clickEndTurnButton();
          //No inning is added
          expect(component.innings).toBe(0);
  
          //Go from Loser to Winner
          clickEndTurnButton();
  
          expect(component.innings).toBe(1);
        })
      })
    })

    describe('innings', () => {
      it('should display an innings title, and number of innings which starts at 0', () => {
        expect(fixture.debugElement.query(By.css('#inningsTitle')).nativeElement.textContent).toBe('Innings');
        expect(fixture.debugElement.query(By.css('#inningsValue')).nativeElement.textContent).toBe('0');
      })
      it('should increment the inning count when "Add Inning" button is pressed', () => {
        clickAddInningButton();

        expect(component.innings).toBe(1);
        expect(fixture.debugElement.query(By.css('#inningsValue')).nativeElement.textContent).toBe('1');
      })
      it('should decrement the inning count when "Decrement Inning" button is pressed', () => {
        clickAddInningButton();
        expect(component.innings).toBe(1);

        clickDecrementInningButton();

        expect(component.innings).toBe(0);
        expect(fixture.debugElement.query(By.css('#inningsValue')).nativeElement.textContent).toBe('0');
      })
      it('should NOT decrement the inning count below 0 when "Decrement Inning" button is pressed', () => {
        expect(component.innings).toBe(0);

        clickDecrementInningButton();

        expect(component.innings).toBe(0);
        expect(fixture.debugElement.query(By.css('#inningsValue')).nativeElement.textContent).toBe('0');
      })
    })
    
    describe('dead balls', () => {
      it('should display an dead balls title, and number of dead balls which starts at 0', () => {
        expect(fixture.debugElement.query(By.css('#deadBallsTitle')).nativeElement.textContent).toBe('Dead Balls');
        expect(fixture.debugElement.query(By.css('#deadBallsValue')).nativeElement.textContent).toBe('0');
      })
    })
  })

  function setupLagWinnerAndLoser() {
    const yourPlayer = DefenseGoneBadPlayers[0];
    const yourCurrentPlayer = {id: yourPlayer.id, name: yourPlayer.name, skill: yourPlayer.skill, team: 'Defense Gone Bad', curScore: 0} as ICurrentPlayer
    const opponentPlayer = HookerPlayers[0];
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
  function clickAddInningButton() {
    let button = fixture.debugElement.query(By.css('button#addInning'));
    button.triggerEventHandler('click', null);
    fixture.detectChanges();
  }
  function clickDecrementInningButton() {
    let button = fixture.debugElement.query(By.css('button#decrementInning'));
    button.triggerEventHandler('click', null);
    fixture.detectChanges();
  }
});
