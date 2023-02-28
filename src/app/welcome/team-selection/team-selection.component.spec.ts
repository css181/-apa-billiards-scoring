import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamSelectionComponent } from './team-selection.component';
import { HttpClientModule } from '@angular/common/http';
import names from '../../../assets/data/team-names.json';
import HookerPlayers from '../../../assets/data/hookers-players.json';
import { TeamsListService } from '../../services/teams-list.service';
import { of } from 'rxjs';
import { By } from "@angular/platform-browser"
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

describe('TeamSelection Component', () => {
  let component: TeamSelectionComponent;
  let fixture: ComponentFixture<TeamSelectionComponent>;
  let mockTeamsListService;

  beforeEach(async () => {
    mockTeamsListService = jasmine.createSpyObj(['getPlayers', 'getNames']);
    mockTeamsListService.getNames.and.returnValue(names);
    mockTeamsListService.getPlayers.and.returnValue(of(HookerPlayers));
    TestBed.configureTestingModule({
      declarations: [ TeamSelectionComponent ],
      providers: [ { provide: TeamsListService, useValue: mockTeamsListService } ],
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(TeamSelectionComponent);
    component = fixture.componentInstance;
    component.teams = names; //This is an input, so lets assign it here to what the input would typically be
    fixture.detectChanges();
  });

  describe('header h2', () => {
    it('should say "Your Team" if isYourTeam is true', ()=> {
      component.isYourTeam = true;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain("Your Team");
    })
    it('should say "Opponent Team" if isYourTeam is false', ()=> {
      component.isYourTeam = false;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain("Opponent Team");
    })
  })
  describe('chosenTeamName property', () => {
    it('should start with a blank value', () => {
      expect(component.getChosenTeamName()).toBe('');
    });

    it('should update when chooseTeam() method is called', () => {
      const chosenTeam: string = component.teams[0];
      
      component.chooseTeam(chosenTeam);

      expect(component.getChosenTeamName()).toEqual(chosenTeam);
    })
  })

  describe('players property', () => {
    it('should start with an empty list', () => {
      expect(component.getPlayers()).toEqual([]);
    })
    it('should update when chooseTeam() method is called', () => {
      const chosenTeam: string = component.teams[0];
      
      component.chooseTeam(chosenTeam);

      expect(component.getPlayers()).toEqual(HookerPlayers);
    })
  })

  describe('players list', () => {
    it('should display only after you click a team', () => {
      let playerNameTableElement = fixture.debugElement.query(By.css('table#playerNamesTable'));
      expect(playerNameTableElement).toBeFalsy();

      const teamLinks: DebugElement[] = fixture.debugElement.queryAll(By.css('a'));
      teamLinks[2].nativeElement.click();
      fixture.detectChanges();
      playerNameTableElement = fixture.debugElement.query(By.css('table#playerNamesTable'));

      expect(playerNameTableElement).toBeTruthy();
    })
  })
});
