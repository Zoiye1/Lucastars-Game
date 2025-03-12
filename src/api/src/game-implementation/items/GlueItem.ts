import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { PickUp } from "../actions/PickUpAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

export class GlueItem extends Item implements Examine, PickUp {
    public static readonly Alias: string = "GlueItem";

    public constructor() {
        super(GlueItem.Alias);
    }

    public name(): string {
        return "Glue";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "This seems to be glue",
        ]);
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    public pickUp(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        playerSession.pickedUpGlue = true;

        return new TextActionResult(["You have picked up the glue!."]);
    }
}
