import { TestBed } from '@angular/core/testing';
import names from '../../assets/data/team-names.json';
import DGBplayers from '../../assets/data/defense-gone-bad-players.json';
import O9APplayers from '../../assets/data/our-9-s-are-private-players.json';
import { TeamsListService } from './teams-list.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IPlayer } from '../interfaces/iplayer';

describe('TeamsListService', () => {
  let service: TeamsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeamsListService]
  });
    service = TestBed.inject(TeamsListService);
  });

  describe('getNames() method', () => {
    it('should return all the team names', () => {
      expect(service.getNames().length).toBe(names.length);
      expect(service.getNames()).toBe(names);
    })
  })

  describe('getPlayers() method', () => {
    it('should return a list of IPlayer for the input team', () => {
      service.getPlayers(names[5]).subscribe(data => {
        expect(data).toEqual(DGBplayers as IPlayer[]);
      });
      service.getPlayers(names[4]).subscribe(data => {
        expect(data).toEqual(O9APplayers as IPlayer[]);
      });
    })
  })

});
