import { IGame } from "./igame";
import { IPlayer } from "./iplayer";

export interface IMatch {
    lagWinner: IPlayer;
    lagLoser: IPlayer;
    games: IGame[];
}
