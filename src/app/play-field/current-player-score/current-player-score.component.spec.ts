import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ICurrentPlayer } from 'src/app/interfaces/icurrentPlayer';
import { SharedDataService } from 'src/app/services/shared-data.service';

import { CurrentPlayerScoreComponent } from './current-player-score.component';

describe('CurrentPlayerScoreComponent', () => {
  let component: CurrentPlayerScoreComponent;
  let sharedService: SharedDataService;
  let fixture: ComponentFixture<CurrentPlayerScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentPlayerScoreComponent ],
      providers: [ SharedDataService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentPlayerScoreComponent);
    sharedService = TestBed.inject(SharedDataService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should obtain all info on LagWinning Player within ngOnInit() if isLagWinner=true', () => {
    component.isLagWinner = true;
    const currentPlayer: ICurrentPlayer = {id: '1111', name:'Bob', skill:4, team:'Hookers', curScore:1};
    component.sharedData.setCurrentPlayerLagWinner(currentPlayer);

    component.ngOnInit();

    expect(component.currentPlayer).toEqual(currentPlayer);
  });
  it('should obtain all info on LagLosing Player within ngOnInit() if isLagWinner=false', () => {
    component.isLagWinner = false;
    const currentPlayer: ICurrentPlayer = {id: '22222', name:'Jane', skill:3, team:'Defense Gone Bad', curScore:2};
    component.sharedData.setCurrentPlayerLagLoser(currentPlayer);

    component.ngOnInit();

    expect(component.currentPlayer).toEqual(currentPlayer);
  });

  describe('scoring table', ()=> {
    beforeEach(() => {
      component.isLagWinner = true;
      const currentPlayer: ICurrentPlayer = {id: '1111', name:'Bob', skill:4, team:'Hookers', curScore:1};
      component.sharedData.setCurrentPlayerLagWinner(currentPlayer);
      component.ngOnInit();
      fixture.detectChanges();
    })

    it('should display the players team, name, skill, current score, remaining needed, and total needed score', () => {
      const mainTable = fixture.debugElement.query(By.css('table'));
      const targetScore = sharedService.getTargetScore(component.currentPlayer.skill);

      expect(mainTable).toBeTruthy();
      expect(mainTable.query(By.css('#playerName')).nativeElement.textContent).toContain(component.currentPlayer.team);
      expect(mainTable.query(By.css('#playerName')).nativeElement.textContent).toContain(component.currentPlayer.name);
      expect(mainTable.query(By.css('#playerSkill')).nativeElement.textContent).toContain(component.currentPlayer.skill);
      expect(mainTable.query(By.css('#playerScore')).nativeElement.textContent).toContain(component.currentPlayer.curScore);
      expect(mainTable.query(By.css('#remainingScore')).nativeElement.textContent).toContain(targetScore - component.currentPlayer.curScore);
      expect(mainTable.query(By.css('#playerScore')).nativeElement.textContent).toContain(targetScore);
    })
    describe('timeouts', ()=> {
      it('should have 2 timeout cells', ()=>{
        const mainTable = fixture.debugElement.query(By.css('table'));
        expect(mainTable).toBeTruthy();
        expect(mainTable.query(By.css('#timeoutFirst'))).toBeTruthy();
        expect(mainTable.query(By.css('#timeoutSecond'))).toBeTruthy();
      })
      it('should always have a yellow timeout image in the first cell', ()=> {
        const timeoutFirst = fixture.debugElement.query(By.css('#timeoutFirstImg'));
        expect(timeoutFirst.nativeElement.src).toContain("timeout.png");
      })
      it('should have a yellow timeout image in the second cell if the player skill is 3 or lower', ()=> {
        initializeComponentWithSkill(3);
        let timeoutFirst = fixture.debugElement.query(By.css('#timeoutSecondImg'));
        expect(timeoutFirst.nativeElement.src).toContain("timeout.png");

        initializeComponentWithSkill(2);
        timeoutFirst = fixture.debugElement.query(By.css('#timeoutSecondImg'));
        expect(timeoutFirst.nativeElement.src).toContain("timeout.png");

        initializeComponentWithSkill(1);
        timeoutFirst = fixture.debugElement.query(By.css('#timeoutSecondImg'));
        expect(timeoutFirst.nativeElement.src).toContain("timeout.png");
      })
      it('should have a white-red timeout image in the second cell if the player skill is 4 or higher', ()=> {
        initializeComponentWithSkill(4);
        let timeoutFirst = fixture.debugElement.query(By.css('#timeoutSecondImg'));
        expect(timeoutFirst.nativeElement.src).toContain("timeout_no.png");
      })
    })

    describe('Clicking different timeout images', ()=> {
      //TODO: Update to pass the name in the emit so we can ensure we add/remove the timeout from the right person
      //TODO: Right now timeouts will only get added/removed correctly if hit in real-time based on what's in the log
      //relies on log not/having a loser turn to know if not/to add/remove it from the loser.
      describe('When clicking a first timeout image', ()=> {
        beforeEach(()=> {
          spyOn(component.timeoutEventEmitter, 'emit');
       
          clickFirstTimeoutImg();
          fixture.detectChanges();
        })
        it('should emit "use timeout" on click of a "timeout" img', () => {
          expect(component.timeoutEventEmitter.emit).toHaveBeenCalledWith('use timeout');
        });
        it('should change the image to timeout_undo', ()=> {
          const timeoutImg = fixture.debugElement.query(By.css('#timeoutFirstImg'));
          expect(timeoutImg.nativeElement.src).toContain("timeout_undo.png");
        })
      })
      describe('When clicking a second timeout image', ()=> {
        beforeEach(()=> {
          initializeComponentWithSkill(3);
          spyOn(component.timeoutEventEmitter, 'emit');
       
          clickSecondTimeoutImg();
          fixture.detectChanges();
        })
        it('should emit "use timeout" on click of a "timeout" img', () => {
          expect(component.timeoutEventEmitter.emit).toHaveBeenCalledWith('use timeout');
        });
        it('should change the image to timeout_undo', ()=> {
          const timeoutImg = fixture.debugElement.query(By.css('#timeoutSecondImg'));
          expect(timeoutImg.nativeElement.src).toContain("timeout_undo.png");
        })
      })
      describe('When clicking a first timeout_undo image', ()=> {
        beforeEach(()=> {
          spyOn(component.timeoutEventEmitter, 'emit');
       
          clickFirstTimeoutImg();
          fixture.detectChanges(); //Use timeout
          clickFirstTimeoutImg();
          fixture.detectChanges(); //Undo timeout
        })
        it('should emit "undo timeout" on click of a "timeout_undo" img', () => {
          expect(component.timeoutEventEmitter.emit).toHaveBeenCalledWith('undo timeout');
        });
        it('should change the image to timeout', ()=> {
          const timeoutImg = fixture.debugElement.query(By.css('#timeoutFirstImg'));
          expect(timeoutImg.nativeElement.src).toContain("timeout.png");
        })
      })
      describe('When clicking a second timeout image', ()=> {
        beforeEach(()=> {
          initializeComponentWithSkill(3);
          spyOn(component.timeoutEventEmitter, 'emit');
       
          clickSecondTimeoutImg();
          fixture.detectChanges();
        })
        it('should emit "use timeout" on click of a "timeout" img', () => {
          expect(component.timeoutEventEmitter.emit).toHaveBeenCalledWith('use timeout');
        });
        it('should change the image to timeout_undo', ()=> {
          const timeoutImg = fixture.debugElement.query(By.css('#timeoutSecondImg'));
          expect(timeoutImg.nativeElement.src).toContain("timeout_undo.png");
        })
      })
      describe('When clicking a timeout_no image', ()=> {
        beforeEach(()=> {
          spyOn(component.timeoutEventEmitter, 'emit');
       
          clickSecondTimeoutImg();
          fixture.detectChanges();
        })
        it('should NOT emit "use timeout" on click of a "timeout" img', () => {
          expect(component.timeoutEventEmitter.emit).not.toHaveBeenCalledWith('use timeout');
        });
        it('should remain image timeout_no', ()=> {
          const timeoutImg = fixture.debugElement.query(By.css('#timeoutSecondImg'));
          expect(timeoutImg.nativeElement.src).toContain("timeout_no.png");
        })
      })
    })
  })

  function initializeComponentWithSkill(newSkill: number) {
    component.isLagWinner = true;
    component.sharedData.getCurrentPlayerLagWinner().skill = newSkill;
    component.ngOnInit();
    fixture.detectChanges();
  }
  function clickFirstTimeoutImg() {
    let updateButton = fixture.debugElement.query(By.css('#timeoutFirstImg'));
    updateButton.triggerEventHandler('click', null);
    fixture.detectChanges();
  }
  function clickSecondTimeoutImg() {
    let updateButton = fixture.debugElement.query(By.css('#timeoutSecondImg'));
    updateButton.triggerEventHandler('click', null);
    fixture.detectChanges();
  }
});
