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
    component.sharedData.addGameToMatch({innings:[{lagWinnerTurn: {name: yourPlayer.name, ballsSunk:[], deadBalls:[]} as ITurn} as IInning]} as IGame, 0);
    
    matchIndex = component.sharedData.getCurrentMatchIndex();
    gameIndex = component.sharedData.getCurrentGameIndex();
    inningIndex = component.sharedData.getCurrentIndexIndex();
    fixture.detectChanges();
  });

  it('should have a way to print the games log to the console', ()=> {
    expect(fixture.debugElement.query(By.css('button#printLog'))).toBeTruthy();
  })

  describe('sharedDataService', ()=> {
    it('should have inningIndex = 0', ()=> {
      expect(component.sharedData.getCurrentIndexIndex()).toBe(0);
    })
  })

  describe('innings', () => {
    it('should display an innings title, and number of innings which starts at 0', () => {
      expect(fixture.debugElement.query(By.css('#inningsTitle')).nativeElement.textContent).toBe('Innings');
      expect(fixture.debugElement.query(By.css('#inningsValue')).nativeElement.textContent).toBe('0');
    })
    it('should increment the inning count when "Add Inning" button is pressed', () => {
      clickAddInningButton();

      expect(component.sharedData.getCurrentIndexIndex()).toBe(1);
      expect(fixture.debugElement.query(By.css('#inningsValue')).nativeElement.textContent).toBe('1');
    })
    it('should decrement the inning count when "Decrement Inning" button is pressed (and have more than 0 innings)', () => {
      clickAddInningButton();
      expect(component.sharedData.getCurrentIndexIndex()).toBe(1);

      clickDecrementInningButton();

      expect(component.sharedData.getCurrentIndexIndex()).toBe(0);
      expect(fixture.debugElement.query(By.css('#inningsValue')).nativeElement.textContent).toBe('0');
    })
    it('should NOT decrement the inning count below 0 when "Decrement Inning" button is pressed', () => {
      expect(component.sharedData.getCurrentIndexIndex()).toBe(0);

      clickDecrementInningButton();

      expect(component.sharedData.getCurrentIndexIndex()).toBe(0);
      expect(fixture.debugElement.query(By.css('#inningsValue')).nativeElement.textContent).toBe('0');
    })
  })
  
  describe('dead balls', () => {
    it('should display an dead balls title, and number of dead balls which starts at 0', () => {
      expect(fixture.debugElement.query(By.css('#deadBallsTitle')).nativeElement.textContent).toBe('Dead Balls');
      expect(fixture.debugElement.query(By.css('#deadBallsValue')).nativeElement.textContent).toBe('0');
    })
    it('should increment the dead ball count when "Add DeadBall" button is pressed', () => {
      clickAddDeadBallButton();

      expect(component.deadBalls).toBe(1);
      expect(fixture.debugElement.query(By.css('#deadBallsValue')).nativeElement.textContent).toBe('1');
    })
    it('should decrement the dead ball count when "Decrement DeadBall" button is pressed', () => {
      clickAddDeadBallButton();
      expect(component.deadBalls).toBe(1);

      clickDecrementDeadBallButton();

      expect(component.deadBalls).toBe(0);
      expect(fixture.debugElement.query(By.css('#deadBallsValue')).nativeElement.textContent).toBe('0');
    })
    it('should NOT decrement the dead ball count below 0 when "Decrement DeadBall" button is pressed', () => {
      expect(component.deadBalls).toBe(0);

      clickDecrementDeadBallButton();

      expect(component.deadBalls).toBe(0);
      expect(fixture.debugElement.query(By.css('#deadBallsValue')).nativeElement.textContent).toBe('0');
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
