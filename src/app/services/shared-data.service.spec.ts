import { TestBed } from '@angular/core/testing';
import HookerPlayers from '../../assets/data/hookers-players.json';
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
});
