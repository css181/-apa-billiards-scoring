import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamSelectionComponent } from './team-selection/team-selection.component';
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
      declarations: [ TeamSelectionComponent ],
      providers: [ { provide: TeamsListService, useValue: mockTeamsListService } ],
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA]
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

  xit('should contain 2 instances of TeamSelection Component', () => {
    const teamTable = fixture.debugElement.query(By.css('table#teamSelections'));
    const rows = teamTable.queryAll(By.css('tr'));
    expect(rows.length).toBe(2);
  });

  describe('confirm button', () => {
    it('should display and send us to play-field when clicked', () => {
      let confirmButtonElement = fixture.debugElement.query(By.css('#confirmButton'));

      expect(confirmButtonElement.nativeElement).toBeTruthy();
      //TODO: Make sure it goes to the right place
      // expect(confirmButtonElement.attributes.get('routerLink'))
    })
  })
  
});
