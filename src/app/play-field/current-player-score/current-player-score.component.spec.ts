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
      expect(mainTable.query(By.css('#remainingNeeded')).nativeElement.textContent).toContain(targetScore - component.currentPlayer.curScore);
      expect(mainTable.query(By.css('#playerScore')).nativeElement.textContent).toContain(targetScore);
    })
  })
});
