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
  })
});
