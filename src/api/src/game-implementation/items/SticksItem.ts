import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Item } from "../../game-base/gameObjects/Item";
import { gameService } from "../../global";
import { PickUp } from "../actions/PickUpAction";
import { PlayerSession } from "../types";

export class SticksItem extends Item implements Examine, PickUp {
    public static readonly Alias: string = "Sticks";

    public constructor() {
        super(SticksItem.Alias);
    }

    /**
     * Handles the pickup action for the sticks.
     * Updates the player's session to indicate the sticks have been collected.
     * @returns A message confirming the player picked up the sticks.
     */
    public pickUp(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        playerSession.pickedupSticks = true;

        return new TextActionResult(["You have picked up the 4 sticks."]);
    }

    public name(): string {
        return "Sticks";
    }

    // Handles the examine action for the sticks.
    public examine(): ActionResult | undefined {
        return new TextActionResult(["These are 4 sticks"]);
    }
}
