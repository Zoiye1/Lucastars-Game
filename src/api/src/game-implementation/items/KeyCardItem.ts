import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { PickUp } from "../actions/PickUpAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

export class KeyCardItem extends Item implements Examine, PickUp {
    public static readonly Alias: string = "KeyCardItem";

    public constructor() {
        super(KeyCardItem.Alias);
    }

    public name(): string {
        return "Key card";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "This seems to be a key card thats used to open something electronic",
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
        playerSession.pickedUpKeyCard = true;

        return new TextActionResult(["You have picked up the Key card!."]);
    }
}
