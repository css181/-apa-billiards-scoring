import { Injectable } from '@angular/core';
import names from '../../assets/data/team-names.json';
import { DashifyNamesPipe } from '../pipes/dashify-names.pipe';
import { HttpClient } from "@angular/common/http";
import { IPlayer } from '../interfaces/iplayer';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamsListService {
  
  constructor(private dashifyPipe: DashifyNamesPipe, private httpClient: HttpClient) { }
  
  getNames():string[] {
    return names;
  }
  getPlayers(teamName: string): Observable<IPlayer[]> {
    const fileName: string = "assets/data/" + (this.dashifyPipe.transform(teamName)) + "-players.json";
    return this.httpClient.get<IPlayer[]>(fileName);
  }

}
