import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { PlayerSession } from "../types";
import { gameService } from "../../global";

export class SugarItem extends Item implements Examine {
    public static readonly Alias: string = "SugarItem";

    public constructor() {
        super(SugarItem.Alias);
    }

    public name(): string {
        return "Sugar";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "This seems to be a large bag of sugar",
        ]);
    }

    public pickUp(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        playerSession.pickedUpSugar = true;

        return new TextActionResult(["You have picked up the Sugar!."]);
    }
}
