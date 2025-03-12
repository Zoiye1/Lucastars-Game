import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Item } from "../../game-base/gameObjects/Item";
import { PlayerSession } from "../types";
import { PickUp } from "../actions/PickUpAction";
import { gameService } from "../../global";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

export class GlassBeakerItem extends Item implements Examine, PickUp {
    public static readonly Alias: string = "Glass Beaker";

    public constructor() {
        super(GlassBeakerItem.Alias);
    }

    public name(): string {
        return "GlassBeaker";
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["It looks like a glass beaker... i wonder if i can use this"]);
    }

    public pickUp(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        playerSession.pickedUpGlassBeaker = true;

        return new TextActionResult(["You have picked up the GlassBeaker!."]);
    }
}
