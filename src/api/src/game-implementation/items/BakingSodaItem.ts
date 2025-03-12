import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Item } from "../../game-base/gameObjects/Item";
import { PlayerSession } from "../types";
import { PickUp } from "../actions/PickUpAction";
import { gameService } from "../../global";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

export class BakingSodaItem extends Item implements Examine, PickUp {
    public static readonly Alias: string = "Baking Soda";

    public constructor() {
        super(BakingSodaItem.Alias);
    }

    public name(): string {
        return "Baking Soda";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["Its baking soda!"]);
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
        playerSession.pickedUpBakingSoda = true;

        return new TextActionResult(["You have picked up the Baking Soda!."]);
    }
}
