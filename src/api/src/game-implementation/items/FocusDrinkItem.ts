import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Item } from "../../game-base/gameObjects/Item";
import { PickUp } from "../actions/PickUpAction";
import { gameService } from "../../global";
import { PlayerSession } from "../types";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

/**
 * Class die het item "Focus Drink" representeert
 *
 * Dit item kan worden onderzocht (Examine) en opgepakt (Pick Up).
 */
export class FocusDrinkItem extends Item implements Examine, PickUp {
    /** Alias die wordt gebruikt om dit item te identificeren */
    public static readonly Alias: string = "FocusDrinkItem";

    public constructor() {
        super(FocusDrinkItem.Alias);
    }

    /**
     * Geeft de naam van het item terug
     *
     * @returns De naam van het item
     */
    public name(): string {
        return "Focus Drink";
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    /**
     * Voert de Examine action uit voor het item
     *
     * @returns Tekst dat beschrijft wat het item is, of `undefined` als de actie niet is afgehandeld
     */
    public examine(): ActionResult | undefined {
        return new TextActionResult(["This is a focus drink."]);
    }

    /**
     * Voert de Pick Up action uit voor het item
     *
     * @returns Tekst dat aangeeft dat het item is opgepakt, of `undefined` als de actie niet is afgehandeld
     */
    public pickUp(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        playerSession.pickedUpFocusDrink = true;

        return new TextActionResult(["You have picked up the focus drink."]);
    }
}
