import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Item } from "../../game-base/gameObjects/Item";
import { PlayerSession } from "../types";
import { PickUp } from "../actions/PickUpAction";
import { gameService } from "../../global";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

export class SulfuricAcidItem extends Item implements Examine, PickUp {
    public static readonly Alias: string = "SulfuricAcidItem";

    public constructor() {
        super(SulfuricAcidItem.Alias);
    }

    public name(): string {
        return "Sulfuric Acid";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["What is this mysterious liquid..."]);
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType {
        return "actionableItem";
    }

    public pickUp(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        playerSession.pickedUpSulfuricAcid = true;

        return new TextActionResult(["You have picked up the SulfuricAcid!."]);
    }
}
