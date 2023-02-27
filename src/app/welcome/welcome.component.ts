import { Component } from '@angular/core';

@Component({
  selector: 'abs-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  private yourTeam: string = '';
  private opponentTeam: string = '';

}
