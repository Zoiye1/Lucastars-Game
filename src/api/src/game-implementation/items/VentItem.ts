import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Item } from "../../game-base/gameObjects/Item";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { Usable } from "../actions/UseAction";

export class VentItem extends Item implements Examine, Usable {
    public static readonly Alias: string = "VentItem";

    public constructor() {
        super(VentItem.Alias);
    }

    public name(): string {
        return "Vent";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["A metal vent cover. It's screwed shut."]);
    }

    public use(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const hasFork: boolean = playerSession.pickedUpFork;

        if (hasFork) {
            playerSession.ventUnlocked = true;
            return new TextActionResult(["You use the fork to unscrew the vent cover. You can now enter the vent."]);
        }

        return new TextActionResult(["You need something to unscrew the vent cover."]);
    }
}
