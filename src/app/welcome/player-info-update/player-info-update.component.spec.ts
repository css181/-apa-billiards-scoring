import { ComponentFixture, flush, fakeAsync, TestBed, tick } from '@angular/core/testing';
import HookerPlayers from '../../../assets/data/hookers-players.json';
import { PlayerInfoUpdateComponent } from './player-info-update.component';
import { By } from "@angular/platform-browser"
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { TeamsListService } from 'src/app/services/teams-list.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

describe('PlayerInfoUpdateComponent', () => {
  let component: PlayerInfoUpdateComponent;
  let fixture: ComponentFixture<PlayerInfoUpdateComponent>;
  let mockTeamsListService;

  beforeEach(async () => {
    mockTeamsListService = jasmine.createSpyObj(['getPlayers']);
    mockTeamsListService.getPlayers.and.returnValue(of(HookerPlayers));
    TestBed.configureTestingModule({
      declarations: [PlayerInfoUpdateComponent],
      providers: [{ provide: TeamsListService, useValue: mockTeamsListService }],
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
    it('should show again if update was clicked and then a different team is selected', () => {
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
      let nonInputBoxes = fixture.debugElement.queryAll(By.css('.playerInfo'));
      expect(nonInputBoxes.length).toBe(8*3);

      //Verify No Inputs for each of the player fields
      let inputIDBoxes = fixture.debugElement.queryAll(By.css('.playerIDInput'));
      expect(inputIDBoxes.length).toBe(0);
      let inputNameBoxes = fixture.debugElement.queryAll(By.css('.playerNameInput'));
      expect(inputNameBoxes.length).toBe(0);
      let inputSkillBoxes = fixture.debugElement.queryAll(By.css('.playerSkillInput'));
      expect(inputSkillBoxes.length).toBe(0);
    })
  })

  describe('update button', () => {
    it('should turn all the player info elements to input boxes', () => {
      component.teamName = 'Hookers';
      component.ngOnChanges();
      fixture.detectChanges();
      let inputBoxes = fixture.debugElement.query(By.css('table#playerNamesTable')).queryAll(By.css('input'));
      expect(inputBoxes.length).toBe(0);
      let tdElements = fixture.debugElement.query(By.css('table#playerNamesTable')).queryAll(By.css('td'));
      expect(tdElements.length).toBe(8 * 3);

      let updateButton = fixture.debugElement.query(By.css('button#updateButton'));
      updateButton.triggerEventHandler('click', null);
      fixture.detectChanges();

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
  })

  describe('save button', () => {
    it('should update the value in players array after update is hit, values are changed, and save is hit', fakeAsync(() => {
      const idChangedValue = '5';
      component.teamName = 'Hookers';
      component.ngOnChanges();
      tick();
      fixture.detectChanges();

      let updateButton = fixture.debugElement.query(By.css('button#updateButton'));
      updateButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      let inputIDBox1 = fixture.debugElement.queryAll(By.css('.playerIDInput'))[0].nativeElement;
      console.log('***************************************');
      console.log('start value: ' + inputIDBox1.value);
      setInputValue(inputIDBox1, idChangedValue);
      let saveButton = fixture.debugElement.query(By.css('button#saveButton'));
      saveButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      inputIDBox1 = fixture.debugElement.queryAll(By.css('.playerIDInput'))[0].nativeElement;
      console.log('end value: ' + inputIDBox1.value);

      console.log(component.getPlayers()[0]);
      expect(component.getPlayers()[0].id).toBe(idChangedValue);
    }))
  })

  // must be called from within fakeAsync due to use of tick()
  function setInputValue(element:any, value:string) {
    element.value = value;
    dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();
  }
});
