import { Input, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGame } from 'src/app/interfaces/igame';
import { IInning } from 'src/app/interfaces/iInnings';
import { IMatch } from 'src/app/interfaces/iMatch';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'abs-match-log',
  templateUrl: './match-log.component.html',
  styleUrls: ['./match-log.component.css']
})
export class MatchLogComponent {
  @Input() matchIndex: number = -1;

  constructor(public sharedData: SharedDataService, private route: ActivatedRoute) { }
  
  ngOnInit() { 
    const matchIndexString: string = this.route.snapshot.paramMap.get('matchIndex') || "0";
    this.matchIndex = parseInt(matchIndexString);
  }

  public getGames(): IGame[] {
    return this.sharedData.getLog()[this.matchIndex].games;
  }
  public getInnings(gameIndex: number): IInning[] {
    return this.getGames()[gameIndex].innings;
  }
  public stringifyJSON(object: any) {
    return JSON.stringify(object);
  }
}
