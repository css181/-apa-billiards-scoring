import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from "@angular/platform-browser"
import { ActivatedRoute } from '@angular/router';
import DefenseGoneBadPlayers from '../../assets/data/defense-gone-bad-players.json'
import HookerPlayers from '../../assets/data/hookers-players.json';
import { IGame } from '../interfaces/igame';
import { IInning } from '../interfaces/iInnings';
import { ITurn } from '../interfaces/iTurn';
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
  const yourPlayer = DefenseGoneBadPlayers[0];
  const opponentPlayer = HookerPlayers[0];
  let matchIndex: number;
  let gameIndex: number;
  let inningIndex: number;

  beforeEach(async () => {
    TestBed.configureTestingModule({ 
      declarations: [ PlayFieldComponent ],
      providers: [ SharedDataService, {provide: ActivatedRoute, useValue: fakeActivatedRoute} ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayFieldComponent);
    component = fixture.componentInstance;

    //Fake out what would be in the lag at the start of this component
    component.sharedData.addMatchToLog(yourPlayer, opponentPlayer);
    component.sharedData.addGameToMatch({innings:[{lagWinnerTurn: {name: yourPlayer.name, ballsSunk:[], deadBalls:[], timeouts: 0} as ITurn} as IInning]} as IGame, 0);
    
    matchIndex = component.sharedData.getCurrentMatchIndex();
    gameIndex = component.sharedData.getCurrentGameIndex();
    inningIndex = component.sharedData.getCurrentInningIndex();
    fixture.detectChanges();
  });

  it('should have a way to print the games log to the console', ()=> {
    expect(fixture.debugElement.query(By.css('button#printLog'))).toBeTruthy();
  })

  describe('sharedDataService', ()=> {
    it('should have inningIndex = 0', ()=> {
      expect(component.sharedData.getCurrentInningIndex()).toBe(0);
    })
  })

  describe('innings', () => {
    it('should display a Game innings title, and number of innings which starts at 0', () => {
      expect(fixture.debugElement.query(By.css('#inningsTitle')).nativeElement.textContent).toBe('Game Innings');
      expect(fixture.debugElement.query(By.css('#inningsValue')).nativeElement.textContent).toBe('0');
    })
    it('should display a Total innings title, and number of innings which starts at 0', () => {
      expect(fixture.debugElement.query(By.css('#totalsTitle')).nativeElement.textContent).toBe('MatchTotals');
      expect(fixture.debugElement.query(By.css('#totalsValues')).nativeElement.textContent).toContain('Innings: 0')
    })
    it('should increment the inning count when "Add Inning" button is pressed', () => {
      clickAddInningButton();

      expect(component.sharedData.getCurrentInningIndex()).toBe(1);
      expect(fixture.debugElement.query(By.css('#inningsValue')).nativeElement.textContent).toBe('1');
    })
    it('should decrement the inning count when "Decrement Inning" button is pressed (and have more than 0 innings)', () => {
      clickAddInningButton();
      expect(component.sharedData.getCurrentInningIndex()).toBe(1);

      clickDecrementInningButton();

      expect(component.sharedData.getCurrentInningIndex()).toBe(0);
      expect(fixture.debugElement.query(By.css('#inningsValue')).nativeElement.textContent).toBe('0');
    })
    it('should NOT decrement the inning count below 0 when "Decrement Inning" button is pressed', () => {
      expect(component.sharedData.getCurrentInningIndex()).toBe(0);

      clickDecrementInningButton();

      expect(component.sharedData.getCurrentInningIndex()).toBe(0);
      expect(fixture.debugElement.query(By.css('#inningsValue')).nativeElement.textContent).toBe('0');
    })
  })
  
  describe('dead balls', () => {
    it('should display a Game dead balls title, and number of dead balls which starts at 0', () => {
      expect(fixture.debugElement.query(By.css('#deadBallsTitle')).nativeElement.textContent).toBe('GameDead Balls');
      expect(fixture.debugElement.query(By.css('#deadBallsValue')).nativeElement.textContent).toBe('0');
    })
    it('should display a Total dead balls title, and number of dead balls which starts at 0', () => {
      expect(fixture.debugElement.query(By.css('#totalsTitle')).nativeElement.textContent).toBe('MatchTotals');
      expect(fixture.debugElement.query(By.css('#totalsValues')).nativeElement.textContent).toContain('DeadBalls: 0')
    })
    it('should increment the dead ball count when "Add DeadBall" button is pressed', () => {
      clickAddDeadBallButton();

      expect(component.sharedData.getCurrentDeadBallCount()).toBe(1);
      expect(fixture.debugElement.query(By.css('#deadBallsValue')).nativeElement.textContent).toBe('1');
    })
    it('should decrement the dead ball count when "Decrement DeadBall" button is pressed', () => {
      clickAddDeadBallButton();
      expect(component.sharedData.getCurrentDeadBallCount()).toBe(1);

      clickDecrementDeadBallButton();

      expect(component.sharedData.getCurrentDeadBallCount()).toBe(0);
      expect(fixture.debugElement.query(By.css('#deadBallsValue')).nativeElement.textContent).toBe('0');
    })
    it('should NOT decrement the dead ball count below 0 when "Decrement DeadBall" button is pressed', () => {
      expect(component.sharedData.getCurrentDeadBallCount()).toBe(0);

      clickDecrementDeadBallButton();

      expect(component.sharedData.getCurrentDeadBallCount()).toBe(0);
      expect(fixture.debugElement.query(By.css('#deadBallsValue')).nativeElement.textContent).toBe('0');
    })
  })

  describe('onTimeoutClicked()', ()=>{
    describe('When on lagWinner turn', ()=> {
      describe('when type is "use timeout"', ()=>{
        beforeEach(()=>{
          component.onTimeoutClicked('use timeout');
        })
        it('should add 1 to the timeouts in the current turn', ()=> {
          const currentInning = component.sharedData.getCurrentGame().innings[component.sharedData.getCurrentInningIndex()];
          expect(currentInning.lagWinnerTurn.timeouts).toBe(1);
        })
      })
      describe('when type is "undo timeout" and timeout exists in the current inning', ()=>{
        beforeEach(()=>{
          const halfInningWithTimeout = { lagWinnerTurn: {ballsSunk: [], deadBalls: [], name: 'Bob', timeouts: 1} as ITurn} as IInning;
          component.sharedData.addInningToLog(halfInningWithTimeout);
          component.onTimeoutClicked('undo timeout');
        })
        it('should remove 1 of the timeouts in the current turn', ()=> {
          const currentInning = component.sharedData.getCurrentGame().innings[component.sharedData.getCurrentInningIndex()];
          expect(currentInning.lagWinnerTurn.timeouts).toBe(0);
        })
      })
      describe('when type is "undo timeout" and timeout exists only in prior inning', ()=>{
        beforeEach(()=>{
          const halfInningWithTimeout = { lagWinnerTurn: {ballsSunk: [], deadBalls: [], name: 'Bob', timeouts: 1} as ITurn} as IInning;
          component.sharedData.addInningToLog(JSON.parse(JSON.stringify(halfInningWithTimeout)));
          component.sharedData.addInningToLog(JSON.parse(JSON.stringify(halfInningWithTimeout)));
          const halfInningWithOutTimeout = { lagWinnerTurn: {ballsSunk: [], deadBalls: [], name: 'Bob', timeouts: 0} as ITurn} as IInning;
          component.sharedData.addInningToLog(JSON.parse(JSON.stringify(halfInningWithOutTimeout)));
          
          expect(component.sharedData.getCurrentGame().innings[0].lagWinnerTurn.timeouts).toBe(0);
          expect(component.sharedData.getCurrentGame().innings[1].lagWinnerTurn.timeouts).toBe(1);
          expect(component.sharedData.getCurrentGame().innings[2].lagWinnerTurn.timeouts).toBe(1);
          expect(component.sharedData.getCurrentGame().innings[3].lagWinnerTurn.timeouts).toBe(0);
          
          component.onTimeoutClicked('undo timeout');
        })
        it('should remove the last timeout present in the most recent turn', ()=> {
          expect(component.sharedData.getCurrentGame().innings[0].lagWinnerTurn.timeouts).toBe(0);
          expect(component.sharedData.getCurrentGame().innings[1].lagWinnerTurn.timeouts).toBe(1);
          expect(component.sharedData.getCurrentGame().innings[2].lagWinnerTurn.timeouts).toBe(0);
          expect(component.sharedData.getCurrentGame().innings[3].lagWinnerTurn.timeouts).toBe(0);
        })
      })
    })
    describe('When on lagLoser turn', ()=> {
      beforeEach(()=>{
        const fullBlankInning = { lagWinnerTurn: {ballsSunk: [], deadBalls: [], name: 'Bob', timeouts: 0} as ITurn,
        lagLoserTurn: {ballsSunk: [], deadBalls: [], name: 'Mary', timeouts: 0} as ITurn } as IInning;
        component.sharedData.addInningToLog(fullBlankInning);
      })
      describe('when type is "use timeout"', ()=>{
        beforeEach(()=>{
          component.onTimeoutClicked('use timeout');
        })
        it('should add 1 to the timeouts in the current turn', ()=> {
          const currentInning = component.sharedData.getCurrentGame().innings[component.sharedData.getCurrentInningIndex()];
          expect(currentInning.lagLoserTurn.timeouts).toBe(1);
        })
      })
      describe('when type is "undo timeout" and timeout exists in the current inning', ()=>{
        beforeEach(()=>{
          const fullInningWithTimeout = { lagWinnerTurn: {ballsSunk: [], deadBalls: [], name: 'Bob', timeouts: 1} as ITurn,
          lagLoserTurn: {ballsSunk: [], deadBalls: [], name: 'Mary', timeouts: 1} as ITurn } as IInning;
          component.sharedData.addInningToLog(fullInningWithTimeout);
          component.onTimeoutClicked('undo timeout');
        })
        it('should remove 1 of the timeouts in the current turn', ()=> {
          const currentInning = component.sharedData.getCurrentGame().innings[component.sharedData.getCurrentInningIndex()];
          expect(currentInning.lagLoserTurn.timeouts).toBe(0);
        })
      })
      describe('when type is "undo timeout" and timeout exists only in prior inning', ()=>{
        beforeEach(()=>{
          const fullInningWithTimeout = { lagWinnerTurn: {ballsSunk: [], deadBalls: [], name: 'Bob', timeouts: 1} as ITurn,
            lagLoserTurn: {ballsSunk: [], deadBalls: [], name: 'Mary', timeouts: 1} as ITurn } as IInning;
          component.sharedData.addInningToLog(JSON.parse(JSON.stringify(fullInningWithTimeout)));
          component.sharedData.addInningToLog(JSON.parse(JSON.stringify(fullInningWithTimeout)));
          const halfInningWithOutTimeout = { lagWinnerTurn: {ballsSunk: [], deadBalls: [], name: 'Bob', timeouts: 0} as ITurn,
            lagLoserTurn: {ballsSunk: [], deadBalls: [], name: 'Mary', timeouts: 0} as ITurn } as IInning;
          component.sharedData.addInningToLog(JSON.parse(JSON.stringify(halfInningWithOutTimeout)));
          
          expect(component.sharedData.getCurrentGame().innings[2].lagLoserTurn.timeouts).toBe(1);
          expect(component.sharedData.getCurrentGame().innings[3].lagLoserTurn.timeouts).toBe(1);
          expect(component.sharedData.getCurrentGame().innings[4].lagLoserTurn.timeouts).toBe(0);
          
          component.onTimeoutClicked('undo timeout');
        })
        it('should remove the last timeout present in the most recent turn', ()=> {
          expect(component.sharedData.getCurrentGame().innings[2].lagLoserTurn.timeouts).toBe(1);
          expect(component.sharedData.getCurrentGame().innings[3].lagLoserTurn.timeouts).toBe(0);
          expect(component.sharedData.getCurrentGame().innings[4].lagLoserTurn.timeouts).toBe(0);
        })
      })
    })
  })

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
  function clickAddDeadBallButton() {
    let button = fixture.debugElement.query(By.css('button#addDeadBall'));
    button.triggerEventHandler('click', null);
    fixture.detectChanges();
  }
  function clickDecrementDeadBallButton() {
    let button = fixture.debugElement.query(By.css('button#decrementDeadBall'));
    button.triggerEventHandler('click', null);
    fixture.detectChanges();
  }
  
});
