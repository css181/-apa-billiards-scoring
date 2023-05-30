import { TestBed } from '@angular/core/testing';
import HookerPlayers from '../../assets/data/hookers-players.json';
import { IGame } from '../interfaces/igame';
import { IInning } from '../interfaces/iInnings';
import { IMatch } from '../interfaces/iMatch';
import { ITurn } from '../interfaces/iTurn';
import { SharedDataService } from './shared-data.service';

describe('SharedDataService', () => {
  let service: SharedDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedDataService);
  });

  it('should store and retrieve your team data', () => {
    service.setYourTeam('Defense Gone Bad');
    expect(service.getYourTeam()).toBe('Defense Gone Bad');
  });
  it('should store and retrieve opponent team data', () => {
    service.setOpponentTeam('Defense Gone Bad');
    expect(service.getOpponentTeam()).toBe('Defense Gone Bad');
  });

  it('should store and retrieve your team player data', () => {
    service.setYourTeamPlayers(HookerPlayers);
    expect(service.getYourTeamPlayers()).toBe(HookerPlayers);
  })
  it('should store and retrieve opponent team player data', () => {
    service.setOpponentTeamPlayers(HookerPlayers);
    expect(service.getOpponentTeamPlayers()).toBe(HookerPlayers);
  })

  describe('decrementInning', ()=> {
    beforeEach(()=> {
      const game = {innings: []} as IGame;
      const match = {lagWinner: HookerPlayers[0], lagLoser: HookerPlayers[1], games: [ game ] } as IMatch;
      const matchList = [match] as IMatch[];
      service.setLog(matchList);
    })
    describe('when less than 2 innings in the current game', ()=>{
      it('should not change the log at all', ()=> {
        const beginLog = service.getLog();
        service.decrementInning();

        expect(service.getLog()).toEqual(beginLog);
      })
    })
    describe('when 2 or more innings in the current game with no balls sunk in them', ()=>{
      beforeEach(()=> {
        const sampleTurn = {ballsSunk: [], deadBalls:[], name: 'Bob'} as ITurn;
        const sampleInning = {lagLoserTurn: sampleTurn, lagWinnerTurn: sampleTurn} as IInning;
        service.addInningToLog(sampleInning);
        service.addInningToLog(sampleInning);
      })
      it('should remove the last inning', ()=> {
        //Clone the log so we can update it
        let expectedLog = JSON.parse(JSON.stringify(service.getLog()));
        service.deleteArrayElement(expectedLog[0].games[0].innings, expectedLog[0].games[0].innings[1]);

        service.decrementInning();

        expect(service.getLog()).toEqual(expectedLog);
      })
      describe('and the latest inning just started so lagLoser has no turn', ()=> {
        beforeEach(()=> {
          const sampleTurn = {ballsSunk: [], deadBalls:[], name: 'Bob'} as ITurn;
          const sampleInning = {lagWinnerTurn: sampleTurn} as IInning;
          service.addInningToLog(sampleInning);
        })
        it('should remove the last full inning', ()=> {
          let expectedLog = JSON.parse(JSON.stringify(service.getLog()));
          service.deleteArrayElement(expectedLog[0].games[0].innings, expectedLog[0].games[0].innings[1]);
  
          service.decrementInning();
  
          expect(service.getLog()).toEqual(expectedLog);
        })
      })
      describe('then with 2 more innings with some balls sunk in them', ()=> {
        beforeEach(()=> {
          const newInning: IInning = {lagWinnerTurn: {ballsSunk: [1,2], deadBalls:[], name: 'Bob'}, lagLoserTurn: {ballsSunk: [3,4], deadBalls:[7], name: 'Mary'}};
          service.addInningToLog(newInning);
          const newInning2: IInning = {lagWinnerTurn: {ballsSunk: [5], deadBalls:[8], name: 'Bob'}, lagLoserTurn: {ballsSunk: [6], deadBalls:[], name: 'Mary'}};
          service.addInningToLog(newInning2);
        })
        it('should remove one of the earlier innings', ()=> {
          let expectedLog = JSON.parse(JSON.stringify(service.getLog()));
          service.deleteArrayElement(expectedLog[0].games[0].innings, expectedLog[0].games[0].innings[1]);
  
          service.decrementInning();
  
          expect(service.getLog()).toEqual(expectedLog);
        })
      })
    })
    describe('when 2 or more innings in the current game with some balls sunk in them (and no blank innings)', ()=> {
      beforeEach(()=> {
        const newInning: IInning = {lagWinnerTurn: {ballsSunk: [1,2], deadBalls:[], name: 'Bob'}, lagLoserTurn: {ballsSunk: [3,4], deadBalls:[7], name: 'Mary'}};
        service.addInningToLog(newInning);
        const newInning2: IInning = {lagWinnerTurn: {ballsSunk: [5], deadBalls:[8], name: 'Bob'}, lagLoserTurn: {ballsSunk: [6], deadBalls:[], name: 'Mary'}};
        service.addInningToLog(newInning2);
      })
      it('should merge the last 2 innings together', ()=> {
        let expectedLog = JSON.parse(JSON.stringify(service.getLog()));
        service.deleteArrayElement(expectedLog[0].games[0].innings, expectedLog[0].games[0].innings[1]);
        service.deleteArrayElement(expectedLog[0].games[0].innings, expectedLog[0].games[0].innings[0]);
        const combinedInning = {lagWinnerTurn: {ballsSunk: [1,2,5], deadBalls: [8], name: 'Bob'}, lagLoserTurn: {ballsSunk: [3,4,6], deadBalls:[7], name: 'Mary'}} as IInning
        expectedLog[0].games[0].innings.push(combinedInning);

        service.decrementInning();

        expect(service.getLog()).toEqual(expectedLog);
      })
    })
  })
});
