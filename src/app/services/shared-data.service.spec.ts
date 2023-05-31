import { TestBed } from '@angular/core/testing';
import HookerPlayers from '../../assets/data/hookers-players.json';
import { IGame } from '../interfaces/igame';
import { IInning } from '../interfaces/iInnings';
import { IMatch } from '../interfaces/iMatch';
import { ITurn } from '../interfaces/iTurn';
import { SharedDataService } from './shared-data.service';

describe('SharedDataService', () => {
  let service: SharedDataService;
  const fullBlankInning = { lagWinnerTurn: {ballsSunk: [], deadBalls: [], name: 'Bob'} as ITurn,
                      lagLoserTurn: {ballsSunk: [], deadBalls: [], name: 'Mary'} as ITurn } as IInning;

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

  describe('addInningToLog()', ()=> {
    beforeEach(()=> {
      const game = {innings: []} as IGame;
      const match = {lagWinner: HookerPlayers[0], lagLoser: HookerPlayers[1], games: [ game ] } as IMatch;
      const matchList = [match] as IMatch[];
      service.setLog(matchList);
    })
    it('should add a new inning to the log', ()=> {
      expect(service.getLog()[0].games[0].innings.length).toBe(0);
      let expectedLog = JSON.parse(JSON.stringify(service.getLog()));
      const sampleTurn = {ballsSunk: [], deadBalls:[], name: 'Bob'} as ITurn;
      const sampleInning = {lagLoserTurn: sampleTurn, lagWinnerTurn: sampleTurn} as IInning;

      service.addInningToLog(sampleInning);

      expect(service.getLog()[0].games[0].innings.length).toBe(1);
      expect(service.getLog()[0].games[0].innings[0]).toEqual(sampleInning);
    })
  })

  describe('decrementInning()', ()=> {
    beforeEach(()=> {
      const game = {innings: []} as IGame;
      const match = {lagWinner: HookerPlayers[0], lagLoser: HookerPlayers[1], games: [ game ] } as IMatch;
      const matchList = [match] as IMatch[];
      service.setLog(matchList);
    })
    describe('when less than 2 innings in the current game', ()=>{
      it('should not change the log at all', ()=> {
        const expectedLog = JSON.parse(JSON.stringify(service.getLog()));
        service.decrementInning();

        expect(service.getLog()).toEqual(expectedLog);
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

  describe('addDeadBall(ballNum)', ()=>{
    it('should add the number into the deadball list of the current shooter', ()=>{
      const startInning = { lagWinnerTurn: {ballsSunk: [], deadBalls: [], name: 'Bob'} as ITurn } as IInning
      const game = {innings: [startInning]} as IGame;
      const match = {lagWinner: HookerPlayers[0], lagLoser: HookerPlayers[1], games: [ game ] } as IMatch;
      const matchList = [match] as IMatch[];
      service.setLog(matchList);
      let expectedLog = JSON.parse(JSON.stringify(service.getLog()));

      //LAG WINNER
      expectedLog[0].games[0].innings[0].lagWinnerTurn.deadBalls.push(0);
      service.addDeadBall(0);

      expect(service.getLog()[0].games[0].innings[0]).toEqual(expectedLog[0].games[0].innings[0]);

      //LAG LOSER
      service.addInningToLog(fullBlankInning);
      expectedLog = JSON.parse(JSON.stringify(service.getLog()));
      expectedLog[0].games[0].innings[1].lagLoserTurn.deadBalls.push(0);
      service.addDeadBall(0);

      expect(service.getLog()[0].games[0].innings[1]).toEqual(expectedLog[0].games[0].innings[1]);
    })
  })
  describe('incrementDeadBall()', ()=> {
    beforeEach(()=> {
      service.gameDeadBallCount = 0;
      service.totalDeadBallCount = 0;
    })
    it('should add to both total and game deadBallCounts', ()=>{
      service.incrementDeadBall();
      expect(service.gameDeadBallCount).toBe(1);
      expect(service.totalDeadBallCount).toBe(1);
    })
  })
  describe('decrementDeadBall()', ()=> {
    describe('when gameDeadBallCount = 0', ()=> {
      beforeEach(()=> {
        service.gameDeadBallCount = 0;
        service.totalDeadBallCount = 0;
      })
      it('should not change anything', ()=>{
        service.decrementDeadBall();
        expect(service.gameDeadBallCount).toBe(0);
        expect(service.totalDeadBallCount).toBe(0);
      })
    })
    describe('when there are some deadballs already in the game', ()=> {
      beforeEach(()=> {
        service.gameDeadBallCount = 5;
        service.totalDeadBallCount = 8;
      })
      it('should decrement both game and total counts', ()=>{
        service.decrementDeadBall();
        expect(service.gameDeadBallCount).toBe(4);
        expect(service.totalDeadBallCount).toBe(7);
      })
    })
  })

  describe('getTotalInningCount()', ()=> {
    it('should return a total count of all innings in all games of the current match', ()=> {
      const startInning = { lagWinnerTurn: {ballsSunk: [], deadBalls: [], name: 'Bob'} as ITurn } as IInning
      let game = {innings: [startInning]} as IGame;
      let match = {lagWinner: HookerPlayers[0], lagLoser: HookerPlayers[1], games: [ game ] } as IMatch;
      let matchList = [match] as IMatch[];
      service.setLog(matchList);
      expect(service.getTotalInningCount()).toBe(0);

      game = {innings: [fullBlankInning, fullBlankInning, fullBlankInning]} as IGame;
      match = {lagWinner: HookerPlayers[0], lagLoser: HookerPlayers[1], games: [ game ] } as IMatch;
      matchList = [match] as IMatch[];
      service.setLog(matchList);
      expect(service.getTotalInningCount()).toBe(2);
      
      match = {lagWinner: HookerPlayers[0], lagLoser: HookerPlayers[1], games: [ game, game, game ] } as IMatch;
      matchList = [match] as IMatch[];
      service.setLog(matchList);
      expect(service.getTotalInningCount()).toBe(6);
    })
  })
});
