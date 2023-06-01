import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IGame } from 'src/app/interfaces/igame';
import { IInning } from 'src/app/interfaces/iInnings';
import { ITurn } from 'src/app/interfaces/iTurn';
import { SharedDataService } from 'src/app/services/shared-data.service';
import DefenseGoneBadPlayers from '../../../assets/data/defense-gone-bad-players.json'
import HookerPlayers from '../../../assets/data/hookers-players.json';
import { GameConfirmComponent } from './game-confirm.component';

describe('GameConfirmComponent', () => {
  let component: GameConfirmComponent;
  let fixture: ComponentFixture<GameConfirmComponent>;
  const yourPlayer = DefenseGoneBadPlayers[0];
  const opponentPlayer = HookerPlayers[0];

  class RouterStub {
    url = '';
    navigate(commands: any[], extras?: any) { }
  }
  const sharedData: SharedDataService = new SharedDataService;
  resetLog();
  sharedData.setCurrentPlayerLagWinner({curScore:10, id:'0', name:yourPlayer.name, skill:yourPlayer.skill, team:''});
  sharedData.setCurrentPlayerLagLoser({curScore:0, id:'0', name:opponentPlayer.name, skill:opponentPlayer.skill, team:''});

  function resetLog() {
    sharedData.setLog([]);
    sharedData.addMatchToLog(yourPlayer, opponentPlayer);
    sharedData.addGameToMatch({innings:[{lagWinnerTurn: {name: yourPlayer.name, ballsSunk:[], deadBalls:[], timeouts: 0} as ITurn} as IInning]} as IGame, 0);
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameConfirmComponent ],
      providers: [ {provide: SharedDataService, useValue: sharedData}, { provide: Router, useClass: RouterStub } ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('after confirming game info', ()=> {
    describe('when lag Loser is shooting', ()=> {
      beforeEach(()=>{
        resetLog();
        component.sharedData.incrementDeadBall();
        const fullInning = { lagWinnerTurn: {ballsSunk: [1,2], deadBalls: [5], name: HookerPlayers[0].name} as ITurn,
          lagLoserTurn: {ballsSunk: [3,4], deadBalls: [6], name: HookerPlayers[1].name} as ITurn } as IInning;
        component.isLagWinnerShooting = false;
        component.sharedData.addInningToLog(fullInning);
      })
      it('should update the Log in sharedData to add a new game, reset the innings length to 1, deadballs to 0, and create a new blank inning for the lagLoser', () => {
        clickConfirmButton();
  
        expect(component.sharedData.getLog()[0].games[1].innings.length).toBe(1);
        expect(component.sharedData.getGameDeadBallCount()).toBe(0);
        expect(component.sharedData.getLog()[0].games[1].innings[0].lagLoserTurn).toEqual({name:component.lagLoserName, ballsSunk: [], deadBalls: [], timeouts: 0} as ITurn);
      })
    })
    describe('when lag Winner is shooting', ()=> {
      beforeEach(()=>{
        resetLog();
        const halfInning = { lagWinnerTurn: {ballsSunk: [1,2], deadBalls: [5], name: HookerPlayers[0].name} as ITurn} as IInning;
        component.isLagWinnerShooting = true;
        component.sharedData.addInningToLog(halfInning);
        component.sharedData.incrementDeadBall();
      })
      it('should update the Log in sharedData to add a new game, reset the innings length to 1, deadballs to 0, and create a new blank inning for the lagWinner', () => {
        clickConfirmButton();
  
        expect(component.sharedData.getLog()[0].games[1].innings.length).toBe(1);
        expect(component.sharedData.getGameDeadBallCount()).toBe(0);
        expect(component.sharedData.getLog()[0].games[1].innings[0].lagWinnerTurn).toEqual({name:component.lagWinnerName, ballsSunk: [], deadBalls: [], timeouts: 0} as ITurn);
      })
    })
  })

  function clickConfirmButton() {
    let button = fixture.debugElement.query(By.css('#confirmScores'));
    button.triggerEventHandler('click', null);
    fixture.detectChanges();
  }
});
