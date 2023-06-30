import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import HookerPlayers from '../../../assets/data/hookers-players.json';
import { PlayerInfoUpdateComponent } from './player-info-update.component';
import { By } from "@angular/platform-browser"
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { TeamsListService } from 'src/app/services/teams-list.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from 'src/app/services/shared-data.service';

describe('PlayerInfoUpdateComponent', () => {
  let component: PlayerInfoUpdateComponent;
  let fixture: ComponentFixture<PlayerInfoUpdateComponent>;
  let mockTeamsListService;

  beforeEach(async () => {
    mockTeamsListService = jasmine.createSpyObj(['getPlayers']);
    mockTeamsListService.getPlayers.and.returnValue(of(HookerPlayers));
    TestBed.configureTestingModule({
      declarations: [PlayerInfoUpdateComponent],
      providers: [{ provide: TeamsListService, useValue: mockTeamsListService }, SharedDataService],
      imports: [HttpClientModule, FormsModule],
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
    it('should show again if update was clicked and then a different team is selected (resetting isUpdateMode)', () => {
      component.teamName = 'Hookers';
      component.ngOnChanges();
      fixture.detectChanges();
      let updateButton = fixture.debugElement.query(By.css('button#updateButton'));
      updateButton.triggerEventHandler('click', null);
      fixture.detectChanges();

      component.teamName = 'Defense Gone Bad';
      component.ngOnChanges();
      fixture.detectChanges();

      //Verify All non-Input TDs
      expect(component.isUpdateMode).toBeFalse();
      let nonInputBoxes = fixture.debugElement.queryAll(By.css('.playerInfo'));
      expect(nonInputBoxes.length).toBe(8 * 3);

      //Verify No Inputs for each of the player fields
      let inputIDBoxes = fixture.debugElement.queryAll(By.css('.playerIDInput'));
      expect(inputIDBoxes.length).toBe(0);
      let inputNameBoxes = fixture.debugElement.queryAll(By.css('.playerNameInput'));
      expect(inputNameBoxes.length).toBe(0);
      let inputSkillBoxes = fixture.debugElement.queryAll(By.css('.playerSkillInput'));
      expect(inputSkillBoxes.length).toBe(0);
    })
    it('should reset hasBeenConfirmed if 1 team is selected, than confirmed, than a new team is selected', () => {
      component.teamName = 'Hookers';
      component.ngOnChanges();
      fixture.detectChanges();
      let confirmButton = fixture.debugElement.query(By.css('button#confirmButton'));
      confirmButton.triggerEventHandler('click', null);
      fixture.detectChanges();

      component.teamName = 'Defense Gone Bad';
      component.ngOnChanges();
      fixture.detectChanges();

      //Verify All non-Input TDs
      expect(component.hasBeenConfirmed).toBeFalse();
    })
  })

  describe('update button', () => {
    it('should only show if not in updateMode', () => {
      setupPlayerInfoUpdateComponent();
      let updateButon = fixture.debugElement.query(By.css('button#updateButton'));
      expect(updateButon).toBeTruthy();

      clickUpdateButton();
      updateButon = fixture.debugElement.query(By.css('button#updateButton'));

      expect(updateButon).toBeFalsy();
    })
    it('should not show if hasBeenConfirmed (even if also not in updateMode)', () => {
      setupPlayerInfoUpdateComponent();
      component.isUpdateMode = false;
      let updateButon = fixture.debugElement.query(By.css('button#updateButton'));
      expect(updateButon).toBeTruthy();

      clickConfirmButton();
      updateButon = fixture.debugElement.query(By.css('button#updateButton'));

      expect(updateButon).toBeFalsy();
    })
    it('should turn all the player info elements to input boxes', () => {
      setupPlayerInfoUpdateComponent();
      let inputBoxes = fixture.debugElement.query(By.css('table#playerNamesTable')).queryAll(By.css('input'));
      expect(inputBoxes.length).toBe(0);
      let tdElements = fixture.debugElement.query(By.css('table#playerNamesTable')).queryAll(By.css('td'));
      expect(tdElements.length).toBe(8 * 3);

      clickUpdateButton();

      //Verify No non-Input TDs
      let nonInputBoxes = fixture.debugElement.queryAll(By.css('.playerInfo'));
      expect(nonInputBoxes.length).toBe(0);

      //Verify Inputs for each of the player fields
      let inputIDBoxes = fixture.debugElement.queryAll(By.css('.playerIDInput'));
      expect(inputIDBoxes.length).toBe(8);
      let inputNameBoxes = fixture.debugElement.queryAll(By.css('.playerNameInput'));
      expect(inputNameBoxes.length).toBe(8);
      let inputSkillBoxes = fixture.debugElement.queryAll(By.css('.playerSkillInput'));
      expect(inputSkillBoxes.length).toBe(8);
    })
    it('should test the input binding to all the <input> display values when the component property values change', () => {
      const idChangedValue = '5';
      setupPlayerInfoUpdateComponent();

      clickUpdateButton();
      let inputIDBox1 = fixture.debugElement.queryAll(By.css('.playerIDInput'))[0].nativeElement;

      component.players[0].id = idChangedValue;
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(inputIDBox1.value).toEqual(idChangedValue);
      });
    })
  })

  describe('save button', () => {
    beforeEach(() => {
      setupPlayerInfoUpdateComponent();
    })
    it('should only show if in updateMode', () => {
      let saveButon = fixture.debugElement.query(By.css('button#saveButton'));
      expect(saveButon).toBeFalsy();

      clickUpdateButton();
      saveButon = fixture.debugElement.query(By.css('button#saveButton'));

      expect(saveButon).toBeTruthy();
    })
    it('should remove the ability to update values via <inputs> anymore after save is hit', () => {
      clickUpdateButton();
      let inputBoxes = fixture.debugElement.query(By.css('table#playerNamesTable')).queryAll(By.css('input'));
      expect(inputBoxes.length).toBe(8 * 3);
      //Verify No non-Input TDs
      let nonInputBoxes = fixture.debugElement.queryAll(By.css('.playerInfo'));
      expect(nonInputBoxes.length).toBe(0);

      clickSaveButton();

      //Verify No Inputs for each of the player fields
      let inputIDBoxes = fixture.debugElement.queryAll(By.css('.playerIDInput'));
      expect(inputIDBoxes.length).toBe(0);
      let inputNameBoxes = fixture.debugElement.queryAll(By.css('.playerNameInput'));
      expect(inputNameBoxes.length).toBe(0);
      let inputSkillBoxes = fixture.debugElement.queryAll(By.css('.playerSkillInput'));
      expect(inputSkillBoxes.length).toBe(0);

      //Verify 8*3 non-Input TDs
      nonInputBoxes = fixture.debugElement.queryAll(By.css('.playerInfo'));
      expect(nonInputBoxes.length).toBe(8 * 3);
    })
    it('should do thing from internet FROM COMPONENT PROPERTY', fakeAsync(() => {
      clickUpdateButton();

      const testValue = 'Component member test'
      component.getPlayers()[0].name = testValue // Should be the correct way to test ngModel
      fixture.detectChanges();
      tick();

      fixture.whenStable().then(() => {
        expect(fixture.debugElement.queryAll(By.css('.playerNameInput'))[0].nativeElement.value).toEqual(testValue)
        expect(component.getPlayers()[0].name).toEqual(testValue);
      });
    }));
    it('should do thing from internet FROM HTML INPUT', fakeAsync(() => {
      clickUpdateButton();

      const testValue = 'NativeElement test'

      let element = fixture.debugElement.queryAll(By.css('.playerNameInput'))[0].nativeElement;
      element.value = testValue // this tests only the out-binding
      element.dispatchEvent(new Event('input'));
      tick();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(fixture.debugElement.queryAll(By.css('.playerNameInput'))[0].nativeElement.value).toEqual(testValue);
        expect(component.getPlayers()[0].name).toEqual(testValue);
      });
    }));
    it('should update the value in players array after update is hit, values are changed, and save is hit', fakeAsync(() => {
      const idChangedValue = '5';
      const nameChangedValue = 'myNewName';
      const skillChangedValue = '9';

      clickUpdateButton();
      let inputIDBox1 = fixture.debugElement.queryAll(By.css('.playerIDInput'))[0].nativeElement;
      setInputValue(inputIDBox1, idChangedValue);
      let inputNameBox1 = fixture.debugElement.queryAll(By.css('.playerNameInput'))[0].nativeElement;
      setInputValue(inputNameBox1, nameChangedValue);
      let inputSkillBox1 = fixture.debugElement.queryAll(By.css('.playerSkillInput'))[0].nativeElement;
      setInputValue(inputSkillBox1, skillChangedValue);

      clickSaveButton();
      let nonInputBoxes = fixture.debugElement.queryAll(By.css('.playerInfo'));
      expect(nonInputBoxes.length).toBe(8 * 3);

      fixture.whenStable().then(() => {
        expect(component.getPlayers()[0].id).toBe(idChangedValue);
        expect(nonInputBoxes[0].nativeElement.textContent).toEqual(idChangedValue);
        expect(component.getPlayers()[0].name).toBe(nameChangedValue);
        expect(nonInputBoxes[1].nativeElement.textContent).toEqual(nameChangedValue);
        expect(component.getPlayers()[0].skill).toBe(parseInt(skillChangedValue)); //Skill must be a number
        expect(nonInputBoxes[2].nativeElement.textContent).toEqual(skillChangedValue);
      });
    }))
  })

  describe('skill Inputs in update mode', () => {
    beforeEach(() => {
      setupPlayerInfoUpdateComponent();
      clickUpdateButton();
    })
    it('should not allow you to enter a skill below 1', fakeAsync(() => {
      const tooLowSkill = '0';
      let inputSkillBox1 = fixture.debugElement.queryAll(By.css('.playerSkillInput'))[0].nativeElement;
      setInputValue(inputSkillBox1, tooLowSkill);

      //TODO: This functionality is working, but this test will not fail even if we reverse the logic.
      fixture.whenStable().then(() => {
        clickSaveButton();
        spyOn(window, "alert");
        expect(window.alert).toHaveBeenCalled();
      });

      const validLowSkill = '1';
      setInputValue(inputSkillBox1, validLowSkill);

      fixture.whenStable().then(() => {
        clickSaveButton();
        expect(window.alert).not.toHaveBeenCalled();
      });
    }))
    it('should not allow you to enter a skill above 9', fakeAsync(() => {
      const tooHighSkill = '10';
      let inputSkillBox1 = fixture.debugElement.queryAll(By.css('.playerSkillInput'))[0].nativeElement;
      setInputValue(inputSkillBox1, tooHighSkill);

      //TODO: This functionality is working, but this test will not fail even if we reverse the logic.
      fixture.whenStable().then(() => {
        clickSaveButton();
        spyOn(window, "alert");
        expect(window.alert).toHaveBeenCalled();
      });

      const validLowSkill = '1';
      setInputValue(inputSkillBox1, validLowSkill);

      fixture.whenStable().then(() => {
        clickSaveButton();
        expect(window.alert).not.toHaveBeenCalled();
      });
    }))
  })

  describe('confirm button', () => {
    it('should not show once it has been clicked', () => {
      setupPlayerInfoUpdateComponent();
      let confirmButon = fixture.debugElement.query(By.css('button#confirmButton'));
      expect(confirmButon).toBeTruthy();

      clickConfirmButton();
      confirmButon = fixture.debugElement.query(By.css('button#confirmButton'));

      expect(confirmButon).toBeFalsy();
    })
    it('should store the players in sharedData for yourPlayers when isYourTeam', () => {
      setupPlayerInfoUpdateComponent();
      component.isYourTeam = true;
      component.players = HookerPlayers;
      expect(component.sharedData.getYourTeamPlayers()).toEqual([]);

      clickConfirmButton();

      expect(component.sharedData.getYourTeamPlayers()).toEqual(HookerPlayers);
    })
    it('should store the players in sharedData for opponentPlayers when isYourTeam=false', () => {
      setupPlayerInfoUpdateComponent();
      component.isYourTeam = false;
      component.players = HookerPlayers;
      expect(component.sharedData.getOpponentTeamPlayers()).toEqual([]);

      clickConfirmButton();

      expect(component.sharedData.getOpponentTeamPlayers()).toEqual(HookerPlayers);
    })
  })

  function setInputValue(element: any, textValue: string) {
    element.value = textValue
    element.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();
  }

  function setupPlayerInfoUpdateComponent() {
    component.teamName = 'Hookers';
    component.ngOnChanges();
    fixture.detectChanges();
  }

  function clickUpdateButton() {
    let updateButton = fixture.debugElement.query(By.css('button#updateButton'));
    updateButton.triggerEventHandler('click', null);
    fixture.detectChanges();
  }
  function clickSaveButton() {
    let updateButton = fixture.debugElement.query(By.css('button#saveButton'));
    updateButton.triggerEventHandler('click', null);
    fixture.detectChanges();
  }
  function clickConfirmButton() {
    let updateButton = fixture.debugElement.query(By.css('button#confirmButton'));
    updateButton.triggerEventHandler('click', null);
    fixture.detectChanges();
  }
});
