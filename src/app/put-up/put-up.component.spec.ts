import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedDataService } from '../services/shared-data.service';
import DefenseGoneBadPlayers from '../../assets/data/defense-gone-bad-players.json'
import HookerPlayers from '../../assets/data/hookers-players.json';
import { blankPlayer, PutUpComponent } from './put-up.component';
import { By } from '@angular/platform-browser';
import { IPlayer } from '../interfaces/iplayer';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ICurrentPlayer } from '../interfaces/icurrentPlayer';
import { Router } from '@angular/router';

describe('PutUpComponent', () => {
  let component: PutUpComponent;
  let fixture: ComponentFixture<PutUpComponent>;

  class RouterStub {
    url = '';
    navigate(commands: any[], extras?: any) { }
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({ 
      declarations: [ PutUpComponent ],
      providers: [ SharedDataService, { provide: Router, useClass: RouterStub } ],
      schemas: [NO_ERRORS_SCHEMA]
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


  describe('Put Up Players confirm div', () => {
    it('should start invisible and become visible only when your team and opponent team selects a player', () => {
      let matchPlayerDiv = fixture.debugElement.query(By.css('div#matchPlayers'));
      expect(matchPlayerDiv).toBeFalsy();

      component.onChooseYourPlayer(DefenseGoneBadPlayers[0]);
      fixture.detectChanges();
      matchPlayerDiv = fixture.debugElement.query(By.css('div#matchPlayers'));
      expect(matchPlayerDiv).toBeFalsy();
      component.onChooseOpponentPlayer(HookerPlayers[0]);
      fixture.detectChanges();
      matchPlayerDiv = fixture.debugElement.query(By.css('div#matchPlayers'));

      expect(matchPlayerDiv).toBeTruthy();
      expect(matchPlayerDiv.nativeElement.textContent).toContain(DefenseGoneBadPlayers[0].name);
      expect(matchPlayerDiv.nativeElement.textContent).toContain(HookerPlayers[0].name);
    })
    it('should contain button for Your Teams player winning the lag', () => {
      const yourTeamPlayer = DefenseGoneBadPlayers[0];
      component.onChooseYourPlayer(yourTeamPlayer);
      component.onChooseOpponentPlayer(HookerPlayers[0]);
      fixture.detectChanges();
      const matchPlayerDiv = fixture.debugElement.query(By.css('div#matchPlayers'));
      const yourTeamWonLagButton = matchPlayerDiv.query(By.css('button#yourTeamWonLag'));

      expect(yourTeamWonLagButton).toBeTruthy();
      expect(yourTeamWonLagButton.nativeElement.textContent).toContain(yourTeamPlayer.name);
      expect(yourTeamWonLagButton.nativeElement.textContent).toContain(yourTeamPlayer.skill);
    })
    it('should contain button for Opponent Teams player winning the lag', () => {
      const opponentTeamPlayer = HookerPlayers[0];
      component.onChooseYourPlayer(DefenseGoneBadPlayers[0]);
      component.onChooseOpponentPlayer(opponentTeamPlayer);
      fixture.detectChanges();
      const matchPlayerDiv = fixture.debugElement.query(By.css('div#matchPlayers'));
      const opponentTeamWonLagButton = matchPlayerDiv.query(By.css('button#opponentTeamWonLag'));

      expect(opponentTeamWonLagButton).toBeTruthy();
      expect(opponentTeamWonLagButton.nativeElement.textContent).toContain(opponentTeamPlayer.name);
      expect(opponentTeamWonLagButton.nativeElement.textContent).toContain(opponentTeamPlayer.skill);
    })
    xit('should have both team win lag buttons re-directs to play-field component when clicked', () => {
      //TODO verify redirect to correct place
    })
  })

  describe('when your team wins the lag and that button is pressed', () => {
    it('should store your chosen player as the lag winner and opponent chosen player as the lag loser in sharedData', () => {
      const yourPlayer = DefenseGoneBadPlayers[0];
      const yourCurrentPlayer = {id: yourPlayer.id, name: yourPlayer.name, skill: yourPlayer.skill, team: 'Defense Gone Bad', curScore: 0} as ICurrentPlayer
      const opponentPlayer = HookerPlayers[0];
      const opponentCurrentPlayer = {id: opponentPlayer.id, name: opponentPlayer.name, skill: opponentPlayer.skill, team: 'Hookers', curScore: 0} as ICurrentPlayer
      component.onChooseYourPlayer(yourPlayer);
      component.onChooseOpponentPlayer(opponentPlayer);
      fixture.detectChanges();

      clickYourTeamWonLagButton();

      expect(component.sharedData.getCurrentPlayerLagWinner()).toEqual(yourCurrentPlayer);
      expect(component.sharedData.getCurrentPlayerLagLoser()).toEqual(opponentCurrentPlayer);
    })
  })
  
  describe('when opponent team wins the lag and that button is pressed', () => {
    it('should store opponent chosen player as the lag winner and your chosen player as the lag loser in sharedData', () => {
      const yourPlayer = DefenseGoneBadPlayers[0];
      const yourCurrentPlayer = {id: yourPlayer.id, name: yourPlayer.name, skill: yourPlayer.skill, team: 'Defense Gone Bad', curScore: 0} as ICurrentPlayer
      const opponentPlayer = HookerPlayers[0];
      const opponentCurrentPlayer = {id: opponentPlayer.id, name: opponentPlayer.name, skill: opponentPlayer.skill, team: 'Hookers', curScore: 0} as ICurrentPlayer
      component.onChooseYourPlayer(yourPlayer);
      component.onChooseOpponentPlayer(opponentPlayer);
      fixture.detectChanges();

      clickOpponentTeamWonLagButton();

      expect(component.sharedData.getCurrentPlayerLagWinner()).toEqual(opponentCurrentPlayer);
      expect(component.sharedData.getCurrentPlayerLagLoser()).toEqual(yourCurrentPlayer);
    })
  })

  function clickYourTeamWonLagButton() {
    let yourTeamWonLagButton = fixture.debugElement.query(By.css('button#yourTeamWonLag'));
    expect(yourTeamWonLagButton).toBeTruthy();
    yourTeamWonLagButton.triggerEventHandler('click', null);
    fixture.detectChanges();
  }
  function clickOpponentTeamWonLagButton() {
    let opponentTeamWonLagButton = fixture.debugElement.query(By.css('button#opponentTeamWonLag'));
    expect(opponentTeamWonLagButton).toBeTruthy();
    opponentTeamWonLagButton.triggerEventHandler('click', null);
    fixture.detectChanges();
  }
});
