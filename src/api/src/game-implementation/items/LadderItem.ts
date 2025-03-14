import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { gameService } from "../../global";
import { PlayerSession } from "../types";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Place } from "../actions/PlaceAction";

/**
 * Class die het item "Ladder" representeert
 *
 * Dit item kan worden geplaatst (Place).
 */
export class LadderItem extends Item implements Place {
    /** Alias die wordt gebruikt om dit item te identificeren */
    public static readonly Alias: string = "LadderItem";

    public constructor() {
        super(LadderItem.Alias);
    }

    /**
     * Geeft de naam van het item terug
     *
     * @returns De naam van het item
     */
    public name(): string {
        return "Ladder";
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["place"];
    }

    /**
     * Voert de Place action uit voor het item
     *
     * @returns Tekst dat aangeeft dat het item is neergelegd, of `undefined` als de actie niet is afgehandeld
     */
    public place(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        playerSession.placedEscapeLadder = true;

        return new TextActionResult(["You have placed the ladder."]);
    }
}
