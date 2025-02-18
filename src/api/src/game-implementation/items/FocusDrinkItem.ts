import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Item } from "../../game-base/gameObjects/Item";
import { PickUp } from "../actions/PickUpAction";
import { gameService } from "../../global";
import { PlayerSession } from "../types";

export class FocusDrinkItem extends Item implements Examine, PickUp {
    public static readonly Alias: string = "FocusDrinkItem";

    public constructor() {
        super(FocusDrinkItem.Alias);
    }

    public name(): string {
        return "Focus Drink";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["This is a focus drink."]);
    }

    public pickUp(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        playerSession.pickedUpFocusDrink = true;

        return new TextActionResult(["You have picked up the focus drink."]);
    }
}
