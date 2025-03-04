import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
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

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    // Handles the examine action for the sticks.
    public examine(): ActionResult | undefined {
        return new TextActionResult(["These are 4 sticks"]);
    }
}
