import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Item } from "../../game-base/gameObjects/Item";
import { PlayerSession } from "../types";
import { PickUp } from "../actions/PickUpAction";
import { gameService } from "../../global";

export class ForkItem extends Item implements Examine, PickUp {
    public static readonly Alias: string = "ForkItem";

    public constructor() {
        super(ForkItem.Alias);
    }

    public name(): string {
        return "Fork";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["This is a Fork."]);
    }

    public pickUp(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        playerSession.pickedUpFork = true;

        return new TextActionResult(["You have picked up the fork!."]);
    }
}
