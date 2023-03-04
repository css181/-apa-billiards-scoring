import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from "@angular/platform-browser"
import { ActivatedRoute } from '@angular/router';
import DefenseGoneBadPlayers from '../../assets/data/defense-gone-bad-players.json'
import HookerPlayers from '../../assets/data/hookers-players.json';
import { ICurrentPlayer } from '../interfaces/icurrentPlayer';
import { SharedDataService } from '../services/shared-data.service';
import { PlayFieldComponent } from './play-field.component';

describe('PlayFieldComponent', () => {
  let component: PlayFieldComponent;
  let fixture: ComponentFixture<PlayFieldComponent>;

  const mockParamMap = { get(attrib: string):string { return 'Defense Gone Bad'}}
  const fakeActivatedRoute = {
    snapshot: { 
      paramMap: mockParamMap
    }
  } as unknown as ActivatedRoute;


  beforeEach(async () => {
    TestBed.configureTestingModule({ 
      declarations: [ PlayFieldComponent ],
      providers: [ SharedDataService, {provide: ActivatedRoute, useValue: fakeActivatedRoute} ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //TEMPORARY TESTS
  it('should display the team names', () => {
    expect(fixture.debugElement.query(By.css('p#yourTeam')).nativeElement.textContent).toContain(component.getYourTeam());
    expect(fixture.debugElement.query(By.css('p#opponentTeam')).nativeElement.textContent).toContain(component.getOpponentTeam());
  })
  it('should display the current Lag winner and loser after going through ngOnInit', () => {
    setupLagWinnerAndLoser();

    component.ngOnInit();
    fixture.detectChanges();
    
    expect(fixture.debugElement.query(By.css('p#lagLoser')).nativeElement.textContent).toContain(component.getLagLosingPlayer().name);
    expect(fixture.debugElement.query(By.css('p#lagWinner')).nativeElement.textContent).toContain(component.getLagWinningPlayer().name);
  })


  it('should display the table of all the ball images', () => {
    const ballTable = fixture.debugElement.query(By.css('table#balls'));
    const imgs = ballTable.queryAll(By.css('.ball'));

    for (var x = 1; x < 10; x++) {
      expect(imgs[x - 1].nativeElement.src).toContain(x + "ball.png");
    }
  });

  it('should contain a lage display of the next ball to hit', () => {
    const upNextImg = fixture.debugElement.query(By.css('.up-next'));
    expect(upNextImg).toBeTruthy;
  })

  describe('updateNextBall() method', () => {
    it('should update the nextBall state of the component', () => {
      expect(component.getNextBall()).toBe(1);

      component.updateNextBall(2);

      expect(component.getNextBall()).toBe(2);
    })

    it('should change the large display of the next ball to hit', () => {
      const upNextImg = fixture.debugElement.query(By.css('.up-next'));
      expect(upNextImg.nativeElement.src).toContain("1ball.png");

      component.updateNextBall(2);
      fixture.detectChanges();
      expect(upNextImg.nativeElement.src).toContain("2ball.png");
    })
  })

  function setupLagWinnerAndLoser() {
    const yourPlayer = DefenseGoneBadPlayers[0];
    const yourCurrentPlayer = {id: yourPlayer.id, name: yourPlayer.name, skill: yourPlayer.skill, team: 'Defense Gone Bad'} as ICurrentPlayer
    const opponentPlayer = HookerPlayers[0];
    const opponentCurrentPlayer = {id: opponentPlayer.id, name: opponentPlayer.name, skill: opponentPlayer.skill, team: 'Hookers'} as ICurrentPlayer
    component.sharedData.setCurrentPlayerLagWinner(yourCurrentPlayer);
    component.sharedData.setCurrentPlayerLagLoser(opponentCurrentPlayer);
  }
});
