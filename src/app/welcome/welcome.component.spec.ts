import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from "@angular/platform-browser"
import { WelcomeComponent } from './welcome.component';
import names from '../../assets/data/team-names.json';
import { TeamsListService } from '../services/teams-list.service';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let mockTeamsListService;

  beforeEach(async () => {
    mockTeamsListService = jasmine.createSpyObj(['getNames']);
    mockTeamsListService.getNames.and.returnValue(names);
    TestBed.configureTestingModule({
      declarations: [ WelcomeComponent ],
      providers: [ { provide: TeamsListService, useValue: mockTeamsListService } ],
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

  describe('confirm button', () => {
    xit('send us to put-up when clicked', () => {
      let confirmButtonElement = fixture.debugElement.query(By.css('#confirmButton'));

      //TODO: Make sure it routes to the right place
      // expect(confirmButtonElement.attributes.get('routerLink'))
    })
    it('should only display once both teams are chosen and confirmed', () => {
      //No names set yet
      fixture.detectChanges();
      let confirmButtonElement = fixture.debugElement.query(By.css('#confirmButton'));
      expect(confirmButtonElement).toBeFalsy();

      //Set and confirm only Opponent
      component.setOpponentTeam('Hookers');
      component.onConfirmClicked(false);
      fixture.detectChanges();
      confirmButtonElement = fixture.debugElement.query(By.css('#confirmButton'));
      expect(confirmButtonElement).toBeFalsy();

      //reset Opponent and set only Your team
      component.setOpponentTeam('');
      component.setIsOpponentTeamConfirmed(false);
      component.setYourTeam('Defense Gone Bad');
      component.onConfirmClicked(true);
      fixture.detectChanges();
      confirmButtonElement = fixture.debugElement.query(By.css('#confirmButton'));
      expect(confirmButtonElement).toBeFalsy();

      //Both set should show (leave your team already set and now also set opponent)
      component.setOpponentTeam('Hookers');
      component.onConfirmClicked(false);
      fixture.detectChanges();
      confirmButtonElement = fixture.debugElement.query(By.css('#confirmButton'));
      expect(confirmButtonElement).toBeTruthy();
    })
    it('should not display if both teams are chosen but have not yet been confirmed', () => {
      //No names set yet
      fixture.detectChanges();
      let confirmButtonElement = fixture.debugElement.query(By.css('#confirmButton'));
      expect(confirmButtonElement).toBeFalsy();

      //Set and confirm only Opponent, set but not confirm your team
      component.setOpponentTeam('Hookers');
      component.onConfirmClicked(false);
      component.setYourTeam('Defense Gone Bad')
      fixture.detectChanges();
      confirmButtonElement = fixture.debugElement.query(By.css('#confirmButton'));
      expect(confirmButtonElement).toBeFalsy();

      //reset Opponent confirm and set and confirm only Your team
      component.setIsOpponentTeamConfirmed(false);
      component.setYourTeam('Defense Gone Bad');
      component.onConfirmClicked(true);
      fixture.detectChanges();
      confirmButtonElement = fixture.debugElement.query(By.css('#confirmButton'));
      expect(confirmButtonElement).toBeFalsy();
    })

    //TODO: if same team is selected for both, we don't want to show confirm (test below),
    //But we also need some way to reset. Worry about this later.
    it('should not show confirm button if the same team was selected and confirmed for you and opponent', () => {
      const sameTeamName = 'Defense Gone Bad';
      component.setOpponentTeam(sameTeamName);
      component.onConfirmClicked(false);
      component.setYourTeam(sameTeamName);
      component.onConfirmClicked(true);

      fixture.detectChanges();
      
      const confirmButtonElement = fixture.debugElement.query(By.css('#confirmButton'));
      expect(confirmButtonElement).toBeFalsy();
    })
  })
  
});
