import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Item } from "../../game-base/gameObjects/Item";
import { gameService } from "../../global";
import { PickUp } from "../actions/PickUpAction";
import { PlayerSession } from "../types";

export class HammerItem extends Item implements Examine, PickUp {
    public static readonly Alias: string = "Hammer";

    public constructor() {
        super(HammerItem.Alias);
    }

    public pickUp(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        playerSession.pickedUpHammer = true;

        return new TextActionResult(["You have picked up the hammer."]);
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    public name(): string {
        return "Hammer";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["This is a hammer"]);
    }
}
