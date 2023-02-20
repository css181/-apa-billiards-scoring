import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from "@angular/platform-browser"
import { PlayFieldComponent } from './play-field.component';

describe('PlayFieldComponent', () => {
  let component: PlayFieldComponent;
  let fixture: ComponentFixture<PlayFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the table of all the ball images', () => {
    const ballTable = fixture.debugElement.query(By.css('table#balls'));
    const imgs = ballTable.queryAll(By.css('.ball'));

    for(var x = 1; x < 10; x++) {
      expect(imgs[x-1].nativeElement.src).toContain(x+"ball.png");
    }
  });

  it('should contain a lage display of the next ball to hit', () => {
    const upNextImg = fixture.debugElement.query(By.css('.up-next'));
    expect(upNextImg).toBeTruthy;
  })

  describe('updateNextBall() method', () => {
    it('should update the nextBall state of the component', ()=> {
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
});
