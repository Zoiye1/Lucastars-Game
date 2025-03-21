import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Open } from "../../game-base/actions/OpenAction";
import { gameService } from "../../global";
import { PlayerSession } from "../types";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";

export class CupBoardItem extends Item implements Examine, Open {
    public static readonly Alias: string = "cupboard";

    public constructor() {
        super(CupBoardItem.Alias);
    }

    public name(): string {
        return "Cupboard";
    }

    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["This is a cupboard."]);
    }

    public open(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        if (!playerSession.cupboardOpened) {
            playerSession.cupboardOpened = true;
            return new TextActionResult(["You open the cupboard and found a sheets."]);
        }
        return new TextActionResult(["The cupboard is already open!"]);
    }
}
