import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from "@angular/platform-browser"
import { WelcomeComponent } from './welcome.component';
import names from '../../assets/data/team-names.json';
import { TeamsListService } from '../services/teams-list.service';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let mockTeamsListService;
  class RouterStub {
    url = '';
    navigate(commands: any[], extras?: any) { }
  }

  beforeEach(async () => {
    mockTeamsListService = jasmine.createSpyObj(['getNames']);
    mockTeamsListService.getNames.and.returnValue(names);
    TestBed.configureTestingModule({
      declarations: [ WelcomeComponent ],
      providers: [ { provide: TeamsListService, useValue: mockTeamsListService}, {provide: Router, useClass: RouterStub } ],
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should get the list of team names', () => {
      component.ngOnInit();

      expect(component.getTeamNames().length).toBe(9);
    })
  })

  it('should contain 2 instances of TeamSelection Component', () => {
    const teamTable = fixture.debugElement.query(By.css('table#teamSelections'));
    const tdsInFirstRow = teamTable.queryAll(By.css('tr'))[0].queryAll(By.css('td'));
    expect(tdsInFirstRow.length).toBe(2);
    //TODO: Get a better expect to ensure it's actually referencing TeamSelection components in those TDs
  });
  it('should contain 2 instances of PlayerInfoUpdate Component', () => {
    const teamTable = fixture.debugElement.query(By.css('table#teamSelections'));
    const tdsInFirstRow = teamTable.queryAll(By.css('tr'))[1].queryAll(By.css('td'));
    expect(tdsInFirstRow.length).toBe(2);
    //TODO: Get a better expect to ensure it's actually referencing PlayerInfoUpdate components in those TDs
  });

  describe('when onTeamSelected("true|a") is called after team was already confirmed', ()=> {
    beforeEach(()=> {
      component.setIsYourTeamConfirmed(true);
      component.onTeamSelected("true|a");
    })
    it('should assign "a" to yourTeamName', ()=> {
      expect(component.getYourTeam()).toBe("a");
    })
    it('should reset isYourTeamConfirmed', ()=> {
      expect(component.getIsYourTeamConfirmed()).toBeFalse();
    })
  })
  describe('when onTeamSelected("false|a") is called after team was already confirmed', ()=> {
    beforeEach(()=> {
      component.setIsOpponentTeamConfirmed(true);
      component.onTeamSelected("false|a");
    })
    it('should assign "a" to opponentTeamName', ()=> {
      expect(component.getOpponentTeam()).toBe("a");
    })
    it('should reset isOpponentTeamConfirmed if it was true', ()=> {
      expect(component.getIsOpponentTeamConfirmed()).toBeFalse();
    })
  })

  describe('when onConfirmClicked(true) is called and both teams have been set and opponent team confirmed', ()=> {
    beforeEach(()=> {
      component.setYourTeam('a');
      component.setOpponentTeam('b');
      component.setIsOpponentTeamConfirmed(true);
    })
    it('should re-route to putUp', ()=> {
      spyOn(component.router, 'navigate').and.stub();

      component.onConfirmClicked(true);

      expect(component.router.navigate).toHaveBeenCalledWith(['/putUp']);
    })
  })
  describe('when onConfirmClicked(false) is called and both teams have been set and your team confirmed', ()=> {
    beforeEach(()=> {
      component.setYourTeam('a');
      component.setOpponentTeam('b');
      component.setIsYourTeamConfirmed(true);
    })
    it('should re-route to putUp', ()=> {
      spyOn(component.router, 'navigate').and.stub();

      component.onConfirmClicked(false);

      expect(component.router.navigate).toHaveBeenCalledWith(['/putUp']);
    })
  })
  describe('when onConfirmClicked(true) is called and both teams have been set to the same team and opponent team confirmed', ()=> {
    beforeEach(()=> {
      const sameTeamName = 'a';
      component.setYourTeam(sameTeamName);
      component.setOpponentTeam(sameTeamName);
      component.setIsOpponentTeamConfirmed(true);
    })
    it('should NOT re-route to putUp', ()=> {
      spyOn(component.router, 'navigate').and.stub();

      component.onConfirmClicked(true);

      expect(component.router.navigate).not.toHaveBeenCalledWith(['/putUp']);
    })
  })
});
