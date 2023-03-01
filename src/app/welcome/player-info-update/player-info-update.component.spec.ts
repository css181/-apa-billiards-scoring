import { ComponentFixture, TestBed } from '@angular/core/testing';
import HookerPlayers from '../../../assets/data/hookers-players.json';
import { PlayerInfoUpdateComponent } from './player-info-update.component';
import { By } from "@angular/platform-browser"
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { TeamsListService } from 'src/app/services/teams-list.service';
import { HttpClientModule } from '@angular/common/http';

describe('PlayerInfoUpdateComponent', () => {
  let component: PlayerInfoUpdateComponent;
  let fixture: ComponentFixture<PlayerInfoUpdateComponent>;
  let mockTeamsListService;

  beforeEach(async () => {
    mockTeamsListService = jasmine.createSpyObj(['getPlayers']);
    mockTeamsListService.getPlayers.and.returnValue(of(HookerPlayers));
    TestBed.configureTestingModule({
      declarations: [ PlayerInfoUpdateComponent ],
      providers: [ { provide: TeamsListService, useValue: mockTeamsListService } ],
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(PlayerInfoUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  describe('players property', () => {
    it('should start with an empty list', () => {
      expect(component.getPlayers()).toEqual([]);
    })
    it('should update when teamName is assigned from input as a change', () => {
      component.teamName = 'Hookers';
      component.ngOnChanges();

      expect(component.getPlayers()).toEqual(HookerPlayers);
    })
  })

  describe('players list', () => {
    it('should display only after a team was chosen, and ngOnChanges() runs', () => {
      let playerNameTableElement = fixture.debugElement.query(By.css('table#playerNamesTable'));
      expect(playerNameTableElement).toBeFalsy();
      
      component.teamName = 'Hookers';
      component.ngOnChanges();
      fixture.detectChanges();
      playerNameTableElement = fixture.debugElement.query(By.css('table#playerNamesTable'));

      expect(playerNameTableElement).toBeTruthy();
    })
  })
});
