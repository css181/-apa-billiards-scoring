import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedDataService } from '../services/shared-data.service';
import DefenseGoneBadPlayers from '../../assets/data/defense-gone-bad-players.json'
import HookerPlayers from '../../assets/data/hookers-players.json';
import { PutUpComponent } from './put-up.component';

describe('PutUpComponent', () => {
  let component: PutUpComponent;
  let fixture: ComponentFixture<PutUpComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({ 
      declarations: [ PutUpComponent ],
      providers: [ SharedDataService ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PutUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should retrieve all sharedData within ngOnInit()', () => {
    component.sharedData.setYourTeam('Defense Gone Bad');
    component.sharedData.setYourTeamPlayers(DefenseGoneBadPlayers);
    component.sharedData.setOpponentTeam('Hookers');
    component.sharedData.setOpponentTeamPlayers(HookerPlayers);

    component.ngOnInit();

    expect(component.getYourTeam()).toBe('Defense Gone Bad');
    expect(component.getYourPlayers()).toEqual(DefenseGoneBadPlayers);
    expect(component.getOpponentTeam()).toBe('Hookers');
    expect(component.getOpponentPlayers()).toEqual(HookerPlayers);
  });
});
