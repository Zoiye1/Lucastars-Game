import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { PickUp } from "../actions/PickUpAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

export class SheetsItem extends Item implements Examine, PickUp {
    public static readonly Alias: string = "Sheets";

    public constructor() {
        super(SheetsItem.Alias);
    }

    public name(): string {
        return "Sheets";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "This seems to be sheets",
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
        playerSession.pickedUpSheets = true;

        return new TextActionResult(["You have picked up the sheets!."]);
    }
}
