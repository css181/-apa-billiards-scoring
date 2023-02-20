import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';
import { HttpClientModule } from '@angular/common/http';
import names from '../../assets/data/team-names.json';
import HookerPlayers from '../../assets/data/hookers-players.json';
import { TeamsListService } from '../services/teams-list.service';
import { of } from 'rxjs';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let mockTeamsListService;

  beforeEach(async () => {
    mockTeamsListService = jasmine.createSpyObj(['getPlayers', 'getNames']);
    mockTeamsListService.getNames.and.returnValue(names);
    mockTeamsListService.getPlayers.and.returnValue(of(HookerPlayers));
    TestBed.configureTestingModule({
      declarations: [ WelcomeComponent ],
      providers: [ { provide: TeamsListService, useValue: mockTeamsListService } ],
      imports: [HttpClientModule]
    });

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should get the list of team names', () => {
      component.ngOnInit();

      expect(component.getTeamNames().length).toBe(8);
    })
  })

  describe('chosenTeamName property', () => {
    it('should start with a blank value', () => {
      expect(component.getChosenTeamName()).toBe('');
    });

    it('should update when chooseTeam() method is called', () => {
      const chosenTeam: string = component.getTeamNames()[0];
      
      component.chooseTeam(chosenTeam);

      expect(component.getChosenTeamName()).toEqual(chosenTeam);
    })
  })

  describe('players property', () => {
    it('should start with an empty list', () => {
      expect(component.getPlayers()).toEqual([]);
    })
    it('should update when chooseTeam() method is called', () => {
      const chosenTeam: string = component.getTeamNames()[0];
      
      component.chooseTeam(chosenTeam);

      expect(component.getPlayers()).toEqual(HookerPlayers);
    })
  })
});
