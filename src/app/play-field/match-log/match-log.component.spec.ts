import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IGame } from 'src/app/interfaces/igame';
import { IInning } from 'src/app/interfaces/iInnings';
import { ITurn } from 'src/app/interfaces/iTurn';
import { SharedDataService } from 'src/app/services/shared-data.service';
import DefenseGoneBadPlayers from '../../../assets/data/defense-gone-bad-players.json'
import HookerPlayers from '../../../assets/data/hookers-players.json';
import { MatchLogComponent } from './match-log.component';

describe('MatchLogComponent', () => {
  let component: MatchLogComponent;
  let fixture: ComponentFixture<MatchLogComponent>;

  const yourPlayer = DefenseGoneBadPlayers[0];
  const opponentPlayer = HookerPlayers[0];

  const mockParamMap = { get(attrib: string):string { return '0'}}
  const fakeActivatedRoute = {
    snapshot: { 
      paramMap: mockParamMap
    }
  } as unknown as ActivatedRoute;

  beforeEach(async () => {
    TestBed.configureTestingModule({ 
      declarations: [ MatchLogComponent ],
      providers: [ SharedDataService, {provide: ActivatedRoute, useValue: fakeActivatedRoute} ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatchLogComponent);
    component = fixture.componentInstance;
    
    //Fake out what would be in the lag at the start of this component
    component.sharedData.addMatchToLog(yourPlayer, opponentPlayer);
    component.sharedData.addGameToMatch({innings:[{lagWinnerTurn: {name: yourPlayer.name, ballsSunk:[], deadBalls:[], timeouts: 0} as ITurn} as IInning]} as IGame, 0);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a table of the logs', ()=> {
    expect(fixture.debugElement.query(By.css('#logs'))).toBeTruthy();
  })
});
