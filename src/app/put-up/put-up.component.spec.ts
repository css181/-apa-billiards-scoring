import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedDataService } from '../services/shared-data.service';
import DefenseGoneBadPlayers from '../../assets/data/defense-gone-bad-players.json'
import HookerPlayers from '../../assets/data/hookers-players.json';
import { blankPlayer, PutUpComponent } from './put-up.component';
import { By } from '@angular/platform-browser';
import { IPlayer } from '../interfaces/iplayer';

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

    component.sharedData.setYourTeam('Defense Gone Bad');
    component.sharedData.setYourTeamPlayers(DefenseGoneBadPlayers);
    component.sharedData.setOpponentTeam('Hookers');
    component.sharedData.setOpponentTeamPlayers(HookerPlayers);
  
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should retrieve all sharedData within ngOnInit()', () => {
    expect(component.getYourTeam()).toBe('Defense Gone Bad');
    expect(component.getYourPlayers()).toEqual(DefenseGoneBadPlayers);
    expect(component.getOpponentTeam()).toBe('Hookers');
    expect(component.getOpponentPlayers()).toEqual(HookerPlayers);
  });

  describe('when selecting a player from Your Team list', () => {
    it('should store the player value selected', () => {
      expect(component.getYourTeamSelectedPlayer()).toEqual(blankPlayer);
      const playerToSelect:IPlayer = DefenseGoneBadPlayers[0];

      clickYourTeamTablePlayerID(playerToSelect.id);

      expect(component.getYourTeamSelectedPlayer()).toEqual(playerToSelect);
    })
    it('should turn the row selected a "selected" color', () => {
      let yourTeamTable = fixture.debugElement.query(By.css('table#yourPlayerNamesTable'));
      let allSelectedRows = yourTeamTable.queryAll(By.css('tr.currentlySelected'));
      expect(allSelectedRows.length).toBe(0);
      const playerToSelect:IPlayer = DefenseGoneBadPlayers[0];

      clickYourTeamTablePlayerID(playerToSelect.id);

      allSelectedRows = yourTeamTable.queryAll(By.css('tr.currentlySelectedYourTeam'));
      expect(allSelectedRows.length).toBe(1);
      expect(allSelectedRows[0].nativeElement.id).toBe('yourPlayers' + playerToSelect.id);
    })
    it('should change the selected row color when a different player is selected', () => {
      let yourTeamTable = fixture.debugElement.query(By.css('table#yourPlayerNamesTable'));
      let allSelectedRows = yourTeamTable.queryAll(By.css('tr.currentlySelected'));
      expect(allSelectedRows.length).toBe(0);
      let playerToSelect:IPlayer = DefenseGoneBadPlayers[0];

      clickYourTeamTablePlayerID(playerToSelect.id);
      playerToSelect = DefenseGoneBadPlayers[1];
      clickYourTeamTablePlayerID(playerToSelect.id);

      allSelectedRows = yourTeamTable.queryAll(By.css('tr.currentlySelectedYourTeam'));
      expect(allSelectedRows.length).toBe(1);
      expect(allSelectedRows[0].nativeElement.id).toBe('yourPlayers' + playerToSelect.id);
    })
  })

  function clickYourTeamTablePlayerID(id: string) {
    let yourTeamTable = fixture.debugElement.query(By.css('table#yourPlayerNamesTable'));
    let tableRow = yourTeamTable.query(By.css('tr#yourPlayers' + id));
    expect(tableRow).toBeTruthy();
    tableRow.triggerEventHandler('click', null);
    fixture.detectChanges();
  }

  
  describe('when selecting a player from Opponent Team list', () => {
    it('should store the player value selected', () => {
      expect(component.getOpponentTeamSelectedPlayer()).toEqual(blankPlayer);
      const playerToSelect:IPlayer = HookerPlayers[0];

      clickOpponentTeamTablePlayerID(playerToSelect.id);

      expect(component.getOpponentTeamSelectedPlayer()).toEqual(playerToSelect);
    })
    it('should turn the row selected a "selected" color', () => {
      let opponentTeamTable = fixture.debugElement.query(By.css('table#opponentPlayerNamesTable'));
      let allSelectedRows = opponentTeamTable.queryAll(By.css('tr.currentlySelected'));
      expect(allSelectedRows.length).toBe(0);
      const playerToSelect:IPlayer = HookerPlayers[0];

      clickOpponentTeamTablePlayerID(playerToSelect.id);

      allSelectedRows = opponentTeamTable.queryAll(By.css('tr.currentlySelectedOpponentTeam'));
      expect(allSelectedRows.length).toBe(1);
      expect(allSelectedRows[0].nativeElement.id).toBe('opponentPlayers' + playerToSelect.id);
    })
    it('should change the selected row color when a different player is selected', () => {
      let opponentTeamTable = fixture.debugElement.query(By.css('table#opponentPlayerNamesTable'));
      let allSelectedRows = opponentTeamTable.queryAll(By.css('tr.currentlySelected'));
      expect(allSelectedRows.length).toBe(0);
      let playerToSelect:IPlayer = HookerPlayers[0];

      clickOpponentTeamTablePlayerID(playerToSelect.id);
      playerToSelect = HookerPlayers[1];
      clickOpponentTeamTablePlayerID(playerToSelect.id);

      allSelectedRows = opponentTeamTable.queryAll(By.css('tr.currentlySelectedOpponentTeam'));
      expect(allSelectedRows.length).toBe(1);
      expect(allSelectedRows[0].nativeElement.id).toBe('opponentPlayers' + playerToSelect.id);
    })
  })

  function clickOpponentTeamTablePlayerID(id: string) {
    let opponentTeamTable = fixture.debugElement.query(By.css('table#opponentPlayerNamesTable'));
    let tableRow = opponentTeamTable.query(By.css('tr#opponentPlayers' + id));
    expect(tableRow).toBeTruthy();
    tableRow.triggerEventHandler('click', null);
    fixture.detectChanges();
  }
});
