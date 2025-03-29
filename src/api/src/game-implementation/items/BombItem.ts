import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { gameService } from "../../global";
import { PlayerSession } from "../types";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Place } from "../actions/PlaceAction";

export class BombItem extends Item implements Place {
    public static readonly Alias: string = "BombItem";

    public constructor() {
        super(BombItem.Alias);
    }

    /**
     * Geeft de naam van het item terug
     *
     * @returns De naam van het item
     */
    public name(): string {
        return "Bomb";
    }

    public type(): GameObjectType[] {
        return ["place"];
    }

    /**
     * Voert de Place action uit voor het item
     *
     * @returns Tekst dat aangeeft dat het item is neergelegd of undefined als de actie niet is afgehandeld
     */

    public place(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        playerSession.placedBomb = true;

        return new TextActionResult(["Bomb has been planned."]);
    }
}
